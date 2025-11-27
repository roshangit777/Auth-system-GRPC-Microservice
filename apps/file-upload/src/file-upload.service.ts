import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CloudinaryService } from "./cloudinary/cloudinary-service";
import { Worker } from "worker_threads";
import fs from "fs";
import path, { join } from "path";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { File } from "./entity/cloudinary.entity";
import { status } from "@grpc/grpc-js";

interface AuthorData {
  name: string;
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface WorkerResponse {
  success: boolean;
  path: string;
}

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject("NOTIFICATION_RECORD_RMQ") private notificationClient: ClientProxy
  ) {}

  async uploadFile(data): Promise<File> {
    const { file, description, user } = data;

    let uploadedImagePath = "";
    let compressedImagePath = "";

    try {
      const result = await new Promise<File>((resolve, reject) => {
        let settled = false;
        const safeResolve = (v) => {
          if (!settled) {
            settled = true;
            resolve(v);
          }
        };
        const safeReject = (e) => {
          if (!settled) {
            settled = true;
            reject(e);
          }
        };

        try {
          const tempDir = path.join(__dirname, "..", "uploads");
          if (!fs.existsSync(tempDir))
            fs.mkdirSync(tempDir, { recursive: true });

          const tempPath = path.join(
            tempDir,
            `${Date.now()}-${file.originalname}`
          );
          uploadedImagePath = tempPath;

          const realBuffer = Buffer.isBuffer(file.buffer)
            ? file.buffer
            : Buffer.from(file.buffer.data);

          fs.writeFileSync(tempPath, realBuffer);

          const workerPath = join(
            process.cwd(),
            "dist",
            "apps",
            "workers",
            "imageCompression.js"
          );
          const worker = new Worker(workerPath, { workerData: { tempPath } });

          const timeout = setTimeout(() => {
            worker.terminate();
            safeReject(
              new RpcException({
                code: status.INTERNAL,
                message: "Worker timed out",
              })
            );
          }, 30000);

          worker.on("message", async (data: WorkerResponse) => {
            try {
              compressedImagePath = data.path;

              const cloudRes = await this.cloudinaryService.uploadFile(
                data.path
              );

              const fileEntity = this.fileRepository.create({
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                publicId: cloudRes.public_id,
                url: cloudRes.secure_url,
                description,
                uploader: Number(user.sub),
                userDetails: {
                  id: Number(user.sub),
                  name: user.name,
                  email: user.email,
                  role: user.role,
                },
              });

              const saved = await this.fileRepository.save(fileEntity);
              clearTimeout(timeout);
              worker.terminate();
              safeResolve(saved);
            } catch (err) {
              clearTimeout(timeout);
              worker.terminate();
              safeReject(
                new RpcException({
                  code: status.INTERNAL,
                  message: err.message,
                })
              );
            }
          });

          worker.on("error", (err) => {
            clearTimeout(timeout);
            worker.terminate();
            safeReject(
              new RpcException({ code: status.INTERNAL, message: err.message })
            );
          });

          worker.on("exit", (code) => {
            if (code !== 0) {
              clearTimeout(timeout);
              safeReject(
                new RpcException({
                  code: status.INTERNAL,
                  message: `Worker exited ${code}`,
                })
              );
            }
          });
        } catch (err) {
          safeReject(
            new RpcException({ code: status.INTERNAL, message: err.message })
          );
        }
      });
      this.notificationClient.emit("record_notification", {
        userId: Number(user.sub),
        type: "success",
        title: "Successfully File Uploaded",
        message: `The file with title "${result.originalName}" has been uploaded.`,
      });
      return result;
    } finally {
      if (uploadedImagePath) fs.promises.rm(uploadedImagePath, { force: true });
      if (compressedImagePath)
        fs.promises.rm(compressedImagePath, { force: true });
    }
  }

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find({});
  }

  async remove(data: { id: string }): Promise<{ message: string }> {
    const fileToBeDeleted = await this.fileRepository.findOne({
      where: { id: data.id },
    });
    if (!fileToBeDeleted) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `File with id ${data.id} not found`,
      });
    }
    //first delete from cloudinary
    await this.cloudinaryService.deleteFile(fileToBeDeleted.publicId);
    //then delete from the db
    await this.fileRepository.remove(fileToBeDeleted);

    return { message: "File delted successfully" };
  }
}
