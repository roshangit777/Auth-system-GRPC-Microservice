import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  EventPattern,
  MessagePattern,
  type ClientGrpc,
} from "@nestjs/microservices";
import { WebsocketGateWay } from "./websocket.gateway";
/* import { AuthGuard } from "apps/common/guards/auth.guard"; */

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Controller("notification")
export class NotificationController implements OnModuleInit {
  private notificationService: any;
  constructor(
    @Inject("NOTIFICATION_CLIENT") private notificationClient: ClientGrpc,
    private websocketGateway: WebsocketGateWay
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationClient.getService("Notification");
  }

  @Get("create")
  createNotification() {
    console.log("This is from api/gateway/notification/Controller");
    return this.notificationService.AddNotification({
      id: 2,
    });
  }

  /*  @MessagePattern("new_notification")
  handleNotification(payload: any) {
    console.log("message form websocket emit:", payload);
    this.websocketGateway.server.emit("newNotification", payload);
  } */

  @MessagePattern("broadcast_notification")
  handleBroadcast(data: any) {
    console.log("from the notification websocket");
    this.websocketGateway.server.emit("notification", data);
  }

  @Get("get/:id")
  getNotification(@Param("id") id: number) {
    return this.notificationService.GetNotification({
      id: Number(id),
    });
  }

  @Put("update/:id")
  updateNotification(@Param("id") id: number) {
    console.log(id);
    return this.notificationService.UpdateNotification({
      id: Number(id),
    });
  }
}
