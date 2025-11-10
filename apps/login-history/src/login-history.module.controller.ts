import { Controller } from "@nestjs/common";
import { LoginHistoryModuleService } from "./login-history.module.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import type { UserDetails } from "./interfaces/userDetails.interface";

@Controller()
export class LoginHistoryModuleController {
  constructor(
    private readonly LoginHistorymoduleService: LoginHistoryModuleService
  ) {}

  @MessagePattern("history.create")
  createHistory(@Payload() data: UserDetails) {
    this.LoginHistorymoduleService.recordLogin(data);
  }

  @MessagePattern("history.find")
  getHistory(@Payload() userId: number | undefined) {
    return this.LoginHistorymoduleService.getUserLoginHistory(userId);
  }
}
