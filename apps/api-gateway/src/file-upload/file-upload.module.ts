import { Module } from "@nestjs/common";
import { FileUploadController } from "./file-upload.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "FILE_UPLOAD_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "fileUpload",
          protoPath: join(process.cwd(), "proto/fileUpload.proto"),
          url:
            `${process.env.FILE_UPLOAD_HOST}:${process.env.FILE_UPLOAD_PORT}` ||
            "0.0.0.0:50053",
        },
      },
    ]),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
