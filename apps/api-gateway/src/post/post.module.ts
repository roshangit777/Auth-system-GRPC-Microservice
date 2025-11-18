import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "POST_CLIENT",
        transport: Transport.GRPC,
        options: {
          package: "post",
          protoPath: join(process.cwd(), "proto/post.proto"),
          url:
            `${process.env.POST_HOST}:${process.env.POST_PORT}` ||
            "0.0.0.0:50051",
        },
      },
    ]),
  ],
  controllers: [PostController],
})
export class PostModule {}
