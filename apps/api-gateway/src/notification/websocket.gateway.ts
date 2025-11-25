/* import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";

@WebSocketGateway()
export class WebsocketGateWay {
  @SubscribeMessage("newMessage")
  handleNewMessage(@MessageBody() message: any) {
    console.log(message);
  }
}
 */

import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: true,
})
export class WebsocketGateWay {
  @WebSocketServer()
  server: Server;
}
