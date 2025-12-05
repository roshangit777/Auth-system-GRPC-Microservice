import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders, Payment } from "./entity/payment.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "root",
      database: "nestjs_payment",
      autoLoadEntities: true,
      synchronize: true,
      entities: [Orders, Payment],
    }),
  ],
})
export class AppModule {}
