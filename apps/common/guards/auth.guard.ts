import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { Request } from "express";

interface Payload {
  sub: number;
  email: string;
  role: string;
}
interface AuthRequest extends Request {
  user?: Payload;
  /* interface Request {
  headers: IncomingHttpHeaders;
  body: any;
  params: any;
  query: any; */
  // ...but there's NO 'user' property here!
  //}
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new RpcException({ status: 401, message: "Token missing" });
    }

    try {
      const secret = "jwtsecret";
      if (!secret) throw new Error("JWT_SECRET not defined");

      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      if (!payload) {
        throw new RpcException({ status: 401, message: "Invalid Token" });
      }
      // assign payload safely
      request.user = payload;
    } catch (error) {
      if (error) {
        throw new RpcException({
          status: 401,
          message: "Invalid Token or Expired Token",
        });
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // NestJS automatically parses cookies if you use cookie-parser
    // so `request.cookies` will be available
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}
