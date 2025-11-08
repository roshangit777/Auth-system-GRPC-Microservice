import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register.dto";
import { LoginUserDto } from "./dto/login.dto";
/* import { LoginHistory } from "apps/events/entity/login-history.entity"; */
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @MessagePattern("user.register")
  async registerUser(@Payload() data: RegisterUserDto) {
    return await this.authServices.userRegister(data);
  }

  @MessagePattern("user.login")
  async userLogin(@Payload() data: LoginUserDto) {
    const token = await this.authServices.loginUser(data);
    return token;
  }

  @MessagePattern("user.refresh")
  async refreshToken(@Payload() data: string) {
    const result = await this.authServices.refreshAndSetToken(data);
    return result;
  }

  @MessagePattern("create.admin")
  async createAdmin(@Payload() data: RegisterUserDto) {
    return await this.authServices.adminRegister(data);
  }

  @MessagePattern("admin.login")
  async adminLogin(@Payload() data: LoginUserDto) {
    const token = await this.authServices.loginAdmin(data);
    return token;
  }

  /*  @MessagePattern("user.history")
  async getAllUserLoginHistory(
    @Payload() id?: number
  ): Promise<LoginHistory[] | string[]> {
    const userId = id ? Number(id) : undefined;
    return await this.authServices.getUserLoginHistory(userId);
  } */
}
