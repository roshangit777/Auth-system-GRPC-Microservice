import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { PaymentController } from "./payment.controller";

@Module({
  imports: [
    ClientsModule.register([
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
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
