import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
/* import { EventsModule } from "src/events/events.module"; */
import { AppModule } from "./app.module";

@Module({
  imports: [
    AppModule,
    TypeOrmModule.forFeature([Users]),
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
