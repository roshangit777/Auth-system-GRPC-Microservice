import { Controller } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { GrpcMethod, MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /* @MessagePattern("record_notification") */

  @MessagePattern("record_notification")
  async saveNotification(userId: number) {
    console.log("This is from notification/Controller");
    await this.notificationService.saveUserNotifications(userId);
  }

  @GrpcMethod("Notification", "AddNotification")
  async saveNotifications(userId: { id: number }) {
    console.log("This is from notification/Controller");
    await this.notificationService.saveUserNotifications(userId.id);
  }

  @GrpcMethod("Notification", "GetNotification")
  async getUserNotification(@Payload() userId: { id: number }) {
    const result = await this.notificationService.userNotification(userId.id);
    return { notifications: result };
  }

  @GrpcMethod("Notification", "UpdateNotification")
  async updateNotificationRead(@Payload() notificationId: { id: number }) {
    await this.notificationService.updateUserNotification(notificationId.id);
  }
}
