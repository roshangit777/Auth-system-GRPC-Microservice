import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Roles } from "apps/common/decorators/roles.decorator";
import { AuthGuard } from "apps/common/guards/auth.guard";
import { RolesGuard } from "apps/common/guards/roles.guard";
import type { UserDetails } from "./interfaces/userDetail.interface";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Controller("login-history")
export class LoginHistoryController {
  constructor(
    @Inject("LOGIN_HISTORY_CLIENT") private loginHistroyClient: ClientProxy
  ) {}

  @Post("create")
  createLoginHistory(@Body() data: UserDetails) {
    this.loginHistroyClient.send("history.create", data);
  }

  @Get("user-history")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  getAllUserLoginHistory(@Query("id") id?: number) {
    const userId = id ? Number(id) : null;
    const load = userId ? userId : {};
    return this.loginHistroyClient.send("history.find", load);
  }
}
