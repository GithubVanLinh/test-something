import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4000, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection<Socket> {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.join(client.id);
    console.log('user', client.id);
    client.emit(
      'connection',
      `hello ${client.id} from server ${process.env.SERVER_NAME}`,
    );
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('data', data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('test')
  async test(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    try {
      console.log(body);
      this.server.to(body.id).emit('test', body);
    } catch (error) {
      console.log(error);
    }
  }
}
