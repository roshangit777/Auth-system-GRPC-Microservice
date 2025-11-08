import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message = "Something went wrong";

    // 1️⃣ If it’s an HttpException (thrown in gateway itself)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        (res as any)?.message || (typeof res === "string" ? res : message);
    }

    // 2️⃣ If it’s an RpcException (from microservice)
    else if (exception instanceof RpcException) {
      const error = exception.getError() as any;
      status = error?.statusCode || error?.status || 500;
      message = error?.message || "Something went wrong";
    }

    // 3️⃣ If it’s a plain serialized object (common in your case)
    else if (typeof exception === "object") {
      status =
        exception?.statusCode ||
        exception?.status ||
        exception?.response?.statusCode ||
        500;

      // handle message safely
      message =
        exception?.message ||
        exception?.response?.message ||
        exception?.response?.error ||
        "Something went wrong";
    }

    // 4️⃣ Fallback (string or unknown)
    else if (typeof exception === "string") {
      message = exception;
    }

    // force numeric status
    if (isNaN(status)) status = 500;

    response.status(Number(status)).json({
      statusCode: Number(status),
      message,
    });
  }
}
