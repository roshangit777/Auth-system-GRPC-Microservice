import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { JwtModule } from "@nestjs/jwt";
import { ProductService } from "./product.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "FILE_UPLOAD_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "fileUpload",
          protoPath: join(process.cwd(), "proto/fileUpload.proto"),
          url: "0.0.0.0:50053",
        },
      },
      {
        name: "PAYMENT_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "payment",
          protoPath: join(process.cwd(), "proto/payment.proto"),
          url: "0.0.0.0:50057",
        },
      },
    ]),
    JwtModule.register({ global: true }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
