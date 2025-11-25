import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
/* import { EventsModule } from "src/events/events.module"; */
import { AppModule } from "./app.module";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    AppModule,
    TypeOrmModule.forFeature([Users]),
    ClientsModule.register([
      {
        name: "LOGIN_HISTORY_RMQ",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://guest:guest@localhost:5672"],
          queue: "login_history_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: "NOTIFICATION_RECORD_RMQ",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://guest:guest@localhost:5672"],
          queue: "notification_record_queue",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: "jwtsecret",
    }),
    /* EventsModule, */
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
