import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { ConfigModule } from "@nestjs/config";
import { AppModule } from "./app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders, Payment } from "./entity/payment.entity";

@Module({
  imports: [
    AppModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([Orders, Payment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
