import { Module } from "@nestjs/common";
import { PurchaseController } from "./purchase.controller";
import { PurchaseService } from "./purchase.service";
import { AppModule } from "./app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders, Payment } from "./entity/payment.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    AppModule,
    TypeOrmModule.forFeature([Orders, Payment]),
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
    ]),
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
