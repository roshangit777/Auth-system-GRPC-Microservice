import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginHistory } from "./entity/login-history.entity";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";
import { UserDetails } from "./interfaces/userDetails.interface";

@Injectable()
export class LoginHistoryModuleService {
  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>
  ) {}

  async recordLogin(data: UserDetails): Promise<void> {
    const login = this.loginHistoryRepository.create({
      user: data.id,
      userDetails: data,
    });
    await this.loginHistoryRepository.save(login);
  }

  async getUserLoginHistory(userId: number | undefined): Promise<any[]> {
    const id =
      typeof userId === "object" && Object.keys(userId).length === 0
        ? null
        : Number(userId);
    if (!id) {
      return await this.loginHistoryRepository.find({});
    } else {
      const history = await this.loginHistoryRepository.find({
        where: { user: id },
        select: ["loginTime"],
      });
      if (!history || history.length === 0) {
        throw new RpcException({
          status: 404,
          message: `Login record of the ${id} not found`,
        });
      }
      return history.map((item) => item.loginTime);
    }
  }
}
