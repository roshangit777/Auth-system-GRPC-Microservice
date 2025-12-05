import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ProductService } from "./product.service";
import { type ClientGrpc, GrpcMethod, Payload } from "@nestjs/microservices";
import { OrderDto } from "./Dto/orderDto";

@Controller()
export class ProductController implements OnModuleInit {
  private fileUploadService: any;
  private paymentService: any;
  constructor(
    @Inject("FILE_UPLOAD_CLIENT") private readonly fileUploadClient: ClientGrpc,
    @Inject("PAYMENT_CLIENT") private readonly paymentClient: ClientGrpc,
    private readonly productService: ProductService
  ) {}

  onModuleInit() {
    this.fileUploadService =
      this.fileUploadClient.getService("FileUploadService");
    this.paymentService = this.paymentClient.getService("PaymentService");
  }

  @GrpcMethod("productService", "GetAllProduct")
  getAllImages() {
    return this.fileUploadService.GetAllFile({});
  }

  @GrpcMethod("productService", "CreateOrder")
  purchaseImage(@Payload() data: OrderDto) {
    return this.paymentService.CreateOrder({ ...data });
  }
}
