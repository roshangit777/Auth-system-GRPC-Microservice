import { Module } from "@nestjs/common";
import { FileUploadController } from "./file-upload.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "FILE_UPLOAD_CLIENT",
        transport: Transport.TCP,
        options: { port: 3003 },
      },
    ]),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
