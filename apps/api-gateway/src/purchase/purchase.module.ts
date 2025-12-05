import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { PurchaseController } from "./purchase.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "PURCHASE_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "purchase",
          protoPath: join(process.cwd(), "proto/purchase.proto"),
          url: "0.0.0.0:50058",
        },
      },
    ]),
  ],
  controllers: [PurchaseController],
})
export class PurchaseModule {}
