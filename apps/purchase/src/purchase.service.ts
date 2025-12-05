import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders, Payment } from "./entity/payment.entity";
import { Repository } from "typeorm";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {}

  async getAllOrders() {
    const result = await this.ordersRepository.find({});
    return { orders: result };
  }

  async getAllSuccessfullOrders() {
    const result = await this.ordersRepository.find({ where: { paid: true } });
    return { orders: result };
  }

  async getUserPurchases(userId: string) {
    const images = await this.ordersRepository.find({
      select: ["fileId"],
      where: { userId: Number(userId), paid: true },
    });
    const purchases = images.map((item) => item.fileId);
    return purchases;
  }
}
