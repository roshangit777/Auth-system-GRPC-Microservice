import { NestFactory } from "@nestjs/core";
import { LoginHistoryModule } from "./login-history.module.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LoginHistoryModule,
    {
      transport: Transport.TCP,
      options: { port: 3004 },
    }
  );
  await app.listen();
}
bootstrap();
