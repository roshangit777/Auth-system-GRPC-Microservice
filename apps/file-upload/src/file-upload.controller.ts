import { Controller } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./entity/cloudinary.entity";

interface AuthorData {
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
interface FileData {
  file: Express.Multer.File;
  uploadfileDto: string | undefined;
  user: AuthorData;
}

@Controller("file-upload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @MessagePattern("file.upload")
  async uploadFile(@Payload() data: FileData): Promise<any> {
    return this.fileUploadService.uploadFile(
      data.file,
      data.uploadfileDto,
      data.user
    );
  }

  @MessagePattern("file.findAll")
  async getFile(): Promise<any[]> {
    return await this.fileUploadService.findAll();
  }

  @MessagePattern("file.delete")
  async deleteFile(@Payload() id: string): Promise<{ message: string }> {
    return await this.fileUploadService.remove(id);
  }
}
