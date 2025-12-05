import { Controller } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { GrpcMethod, Payload } from "@nestjs/microservices";

interface AuthorData {
  name: string;
  sub: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
interface FileData {
  file: Express.Multer.File;
  description: string | undefined;
  user: AuthorData;
}

@Controller("file-upload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @GrpcMethod("FileUploadService", "UploadFile")
  async uploadFile(@Payload() data: FileData): Promise<any> {
    return this.fileUploadService.uploadFile({
      file: data.file,
      description: data.description,
      user: data.user,
    });
  }

  @GrpcMethod("FileUploadService", "GetAllFile")
  async getFile() {
    console.log("3 from file-uplaod");
    const result = await this.fileUploadService.findAll();
    return { files: result };
  }

  @GrpcMethod("FileUploadService", "DeleteFile")
  async deleteFile(@Payload() data: any): Promise<{ message: string }> {
    return await this.fileUploadService.remove({ id: data.id });
  }

  @GrpcMethod("FileUploadService", "GetPurchasedFiles")
  async handleGetPurchasedFiles(@Payload() data: { ids: string[] }) {
    const result = await this.fileUploadService.getPurchasedFiles(data.ids);
    return { files: result };
  }
}
