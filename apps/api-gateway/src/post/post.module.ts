import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "POST_CLIENT",
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
  ],
  controllers: [PostController],
})
export class PostModule {}
