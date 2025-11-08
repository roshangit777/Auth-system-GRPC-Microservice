import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
/* import { LoginThrottlerGuard } from "./guards/login-throttler.guard"; */
import { AuthGuard } from "./../../../common/guards/auth.guard";
import { CurrentUser } from "../../../common/decorators/current-user.decorator";
import { Roles } from "../../../common/decorators/roles.decorator";
import { RolesGuard } from "./../../../common/guards/roles.guard";
import { RegisterUserDto } from "./dto/register.dto";
import { LoginUserDto } from "./dto/login.dto";
/* import { LoginHistory } from "apps/events/entity/login-history.entity"; */
import type { Request, Response } from "express";
import { LoginToken } from "./interfaces/LoginToken.interface";
import { lastValueFrom } from "rxjs";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Controller("auth")
export class AuthController {
  constructor(@Inject("AUTH_CLIENT") private authClient: ClientProxy) {}

  @Post("user/register")
  registerUser(@Body() data: RegisterUserDto) {
    return this.authClient.send("user.register", data);
  }

  /* @UseGuards(LoginThrottlerGuard) */
  @Post("user/login")
  async userLogin(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await lastValueFrom(
      this.authClient.send<LoginToken>("user.login", data)
    );

    //Set cookie securely
    res.cookie("refresh_token", token?.refresh_token, {
      httpOnly: true, // can't be accessed by JS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return {
      message: "Logged in successfull",
      access_token: token.access_token,
    };
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getProfile(
    @CurrentUser() user: { sub: number; email: string; role: string }
  ) {
    return { id: user.sub, email: user.email, role: user.role };
  }

  @Get("/refresh")
  async refreshToken(@Req() req: Request) {
    const token = req.cookies?.["refresh_token"];

    if (!token) {
      throw new RpcException({
        status: 404,
        message: "Refresh token not found",
      });
    }
    const result: string = await lastValueFrom(
      this.authClient.send("user.refresh", token)
    );

    return {
      message: "access_token refreshed successfully",
      access_token: result,
    };
  }

  @Post("create-admin")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  createAdmin(@Body() data: RegisterUserDto) {
    return this.authClient.send("create.admin", data);
  }

  @Post("admin-login")
  async adminLogin(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await lastValueFrom(
      this.authClient.send<LoginToken>("admin.login", data)
    );
    //Set cookie securely
    res.cookie("refresh_token", token.refresh_token, {
      httpOnly: true, // can't be accessed by JS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return {
      message: "Logged in successfull",
      access_token: token.access_token,
    };
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  allLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("refresh_token");
    return { message: "Logged out successfully" };
  }
  /* 
  @Get("user-history")
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUserLoginHistory(
    @Query("id") id?: number
  ): Promise<LoginHistory[] | string[]> {
    const userId = id ? Number(id) : null;
    const load = userId ? userId : {};
    const data = await lastValueFrom(
      this.authClient.send<string[]>("user.history", load)
    );
    return data;
  } */
}
