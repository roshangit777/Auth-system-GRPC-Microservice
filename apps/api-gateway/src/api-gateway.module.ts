import { Module } from "@nestjs/common";
import { ApiGatewayController } from "./api-gateway.controller";
import { ApiGatewayService } from "./api-gateway.service";
import { AuthModule } from "./auth/auth.module";
import { PostModule } from "./post/post.module";
import { FileUploadModule } from "./file-upload/file-upload.module";
import { JwtModule } from "@nestjs/jwt";
import { LoginHistoryModule } from "./login-history/login-history.module";
import { NotificationModule } from "./notification/notification.module";

@Module({
  imports: [
    AuthModule,
    PostModule,
    FileUploadModule,
    JwtModule.register({
      global: true,
    }),
    LoginHistoryModule,
    NotificationModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
