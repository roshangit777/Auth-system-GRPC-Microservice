import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageType, Notification } from "./entity/notification.entity";
import { Repository } from "typeorm";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";

export enum NotificationTitle {
  LOGIN = "Login",
}
export enum NotificationMessage {
  LOGIN = "Welcome to Application",
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @Inject("NOTIFICATION_RMQ") private notificationClient: ClientProxy
  ) {}

  async saveUserNotifications(id: number) {
    console.log("This is from notification/service");
    const result = this.notificationRepository.create({
      user: id,
      title: NotificationTitle.LOGIN,
      message: NotificationMessage.LOGIN,
      type: MessageType.INFO,
    });
    console.log(result);
    await this.notificationRepository.save(result);
    this.notificationClient.emit("broadcast_notification", {
      title: NotificationTitle.LOGIN,
      message: NotificationMessage.LOGIN,
      type: MessageType.INFO,
    });
  }

  async userNotification(id: number) {
    const result = await this.notificationRepository.find({
      where: { user: id },
    });
    if (result.length === 0) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "Notification doesn't exist",
      });
    }
    return result;
  }

  async updateUserNotification(id: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: id },
    });
    if (!notification) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: "Notification doesn't exist",
      });
    }
    await this.notificationRepository.update({ id }, { isRead: true });
  }
}
