import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { status } from "@grpc/grpc-js";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const httpError = this.mapGrpcErrorToHttp(err);
        return throwError(() => httpError);
      })
    );
  }

  private mapGrpcErrorToHttp(err: any): HttpException {
    // Extract actual gRPC error object
    const errorObj =
      err instanceof RpcException
        ? err.getError()
        : err.error
          ? err.error
          : err.cause
            ? err.cause
            : err;

    const grpcCode = errorObj?.code ?? status.INTERNAL;

    // CLEAN MESSAGE (remove "3 INVALID_ARGUMENT:" etc.)
    let grpcMessage = errorObj?.message ?? "gRPC error occurred";

    if (typeof grpcMessage === "string") {
      const parts = grpcMessage.split(":");
      grpcMessage =
        parts.length > 1 ? parts.slice(1).join(":").trim() : grpcMessage;
    }

    const map = {
      [status.NOT_FOUND]: 404,
      [status.INVALID_ARGUMENT]: 400,
      [status.UNAUTHENTICATED]: 401,
      [status.PERMISSION_DENIED]: 403,
      [status.ALREADY_EXISTS]: 409,
      [status.FAILED_PRECONDITION]: 412,
      [status.UNIMPLEMENTED]: 501,
      [status.UNAVAILABLE]: 503,
      [status.INTERNAL]: 500,
    };

    const httpStatus = map[grpcCode] || 500;

    return new HttpException(
      {
        statusCode: httpStatus,
        message: grpcMessage, // cleaned message only
      },
      httpStatus
    );
  }
}
