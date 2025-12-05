import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { ProductController } from "./product.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PRODUCT_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "product",
          protoPath: join(process.cwd(), "proto/product.proto"),
          url: "0.0.0.0:50056",
        },
      },
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
