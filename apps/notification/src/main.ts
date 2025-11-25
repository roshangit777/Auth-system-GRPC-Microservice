import { NestFactory } from "@nestjs/core";
import { NotificationModule } from "./notification.module";
import { Transport } from "@nestjs/microservices";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: "notification",
      protoPath: join(process.cwd(), "proto/notification.proto"),
      url: "0.0.0.0:50055",
    },
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://guest:guest@localhost:5672"],
      queue: "notification_record_queue",
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  console.log("Notification service is running on 50055 grpc port");
}
bootstrap();
