import { Controller, Get } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { GrpcMethod, Payload } from "@nestjs/microservices";
import type { PaymentCheck } from "./interfaces/payment.interface";

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod("PaymentService", "CreateOrder")
  async handleCreateOrder(@Payload() data) {
    const result = await this.paymentService.createOrder(data);
    const res = await this.handleCreatePayment(result);
    console.log("Confirmed payment------->", res);
    return res;
  }

  async handleCreatePayment(data: PaymentCheck) {
    return await this.paymentService.createPayment(data);
  }

  @GrpcMethod("PaymentService", "PaymentCheck")
  async handlePaymentCheck(@Payload() paymentID: { data: string }) {
    return await this.paymentService.paymentCheck(paymentID.data);
  }
}
