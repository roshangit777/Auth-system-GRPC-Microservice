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
        name: "LOGIN_HISTORY_CLIENT",
        transport: Transport.TCP,
        options: { port: 3004 },
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
