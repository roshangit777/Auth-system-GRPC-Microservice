import { Module } from "@nestjs/common";
import { LoginHistoryController } from "./login-history.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "LOGIN_HISTORY_CLIENT",
        transport: Transport.TCP,
        options: { port: 3004 },
      },
    ]),
  ],
  controllers: [LoginHistoryController],
})
export class LoginHistoryModule {}
