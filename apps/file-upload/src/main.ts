import { NestFactory } from '@nestjs/core';
import { FileUploadModule } from './file-upload.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileUploadModule,
    {
      transport: Transport.TCP,
      options: { port: 3003 },
    },
  );
  await app.listen();
}
bootstrap();
