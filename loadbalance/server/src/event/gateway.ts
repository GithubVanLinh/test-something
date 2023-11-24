import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

type Board = Array<Array<string>>;
type Position = [number, number];

class Room {
  x?: string;
  o?: string;
  cur: number;
  name: number;
  board: Board;
  constructor(data: { x?: string; o?: string; name: number }) {
    this.newEmptyBoard();
    this.name = data.name;
    this.x = data.x;
    this.o = data.o;
    this.cur = 0;
    if (this.x) {
      this.cur++;
    }
    if (this.o) {
      this.cur++;
    }
  }

  genMys(sign: string, num?: number, x?: number, y?: number) {
    if (!num) {
      const lx = typeof x === 'number' ? x : Math.round(Math.random() * 19);
      const ly = typeof y === 'number' ? y : Math.round(Math.random() * 19);
      if (this.emptyPoint([lx, ly])) {
        this.setMys(sign, [lx, ly]);
      } else {
        this.genMys(sign);
      }
    } else {
      for (let i = 0; i < num; i++) {
        const lX = Math.round(Math.random() * 19);
        const ly = Math.round(Math.random() * 19);
        const position: Position = [lX, ly];
        if (this.emptyPoint(position)) {
          this.setMys(sign, position);
        } else {
          this.genMys(sign);
        }
      }
    }
  }

  setMys(sign: string, [x, y]: Position) {
    this.board[x][y] = sign;
  }

  emptyPoint([x, y]: Position) {
    return this.board[x][y] === null;
  }

  nextTo(x: number, y: number): [number, number] {
    if (x < 19) {
      return [x + 1, y];
    } else if (y < 19) {
      return [0, y + 1];
    } else {
      return [0, 0];
    }
  }

  getPoint([x, y]: Position): string {
    return this.board[x][y];
  }

  check(p: Position, text: string): { isWin: boolean; event: string } {
    const reponse = { event: null, isWin: false };
    if (!this.emptyPoint(p)) {
      const curSign = this.getPoint(p);
      switch (curSign) {
        case '?':
          reponse.event = 'new event';
          break;
        default:
          return;
      }
    }
    const [x, y] = p;
    this.board[x][y] = text;

    let [h, v, lr, rl] = [1, 1, 1, 1];
    const vectorhl = [-1, 0];
    const vectorhr = [1, 0];
    const vectorvt = [0, -1];
    const vectorvb = [0, 1];
    const vectorlrt = [-1, -1];
    const vectorlrb = [1, 1];
    const vectorrlt = [1, -1];
    const vectorrlb = [-1, 1];

    h += this.counter(x, y, vectorhl, text);
    h += this.counter(x, y, vectorhr, text);
    v += this.counter(x, y, vectorvb, text);
    v += this.counter(x, y, vectorvt, text);
    rl += this.counter(x, y, vectorrlb, text);
    rl += this.counter(x, y, vectorrlt, text);
    lr += this.counter(x, y, vectorlrb, text);
    lr += this.counter(x, y, vectorlrt, text);

    if (v == 5 || h == 5 || rl == 5 || lr == 5) {
      reponse.isWin = true;
    }
    return reponse;
  }

  counter(
    x: number,
    y: number,
    vector: [number, number] | number[],
    text: string,
  ) {
    let count = 0;
    for (let i = 0; i < 4 && x < 19 && x > 0 && y < 19 && y > 0; i++) {
      x += vector[0];
      y += vector[1];
      if (this.board[x][y] === text) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  newEmptyBoard() {
    const map = new Array(20);
    for (let i = 0; i < 20; i++) {
      map[i] = new Array(20).fill(null);
    }
    this.board = map;
  }
}

@WebSocketGateway(4000, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  list: Array<Room> = [];

  @WebSocketServer()
  server: Server;

  handleDisconnect(
    client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  ) {
    const id = client.id;
    console.log('disconnect', id);
    const room = this.list.find((x) => x.x === id || x.o === id);
    if (room.x === id) {
      room.x = null;
    } else {
      room.o = null;
    }
    room.cur--;
    // console.log(room);
    room.newEmptyBoard();

    this.server.to(gameNameFormat(room.name.toString())).emit('end-game', {
      message: 'end game',
    });
  }

  handleConnection(client: Socket & { room: any; sign: string }) {
    const id = client.id;
    let type: string;
    let room = this.list.find((x) => x.cur < 2);
    if (!room) {
      room = new Room({
        x: id,
        name: this.list.length ? this.list[this.list.length - 1].name + 1 : 1,
      });
      type = 'x';
      this.list.push(room);
    } else {
      room.cur++;
      if (!room.x) {
        type = 'x';
        room.x = id;
      } else {
        type = 'o';
        room.o = id;
      }
    }
    client.join('game_' + room.name.toString());
    client.room = room;
    client.sign = type;
    console.log('user', client.id);
    client.emit('connection', {
      server_name: process.env.SERVER_NAME,
      room: room,
      type: type,
    });

    if (room.cur == 2) {
      this.startGame(room);
    }
    // console.log('list', this.list);
  }

  startGame(room: Room) {
    room.genMys('?', null, 0, 0);
    room.genMys('?', 5);
    room.genMys('rock', 5);

    setTimeout(() => {
      this.server.to(gameNameFormat(room.name.toString())).emit('start-game', {
        message: 'start game',
        room: deepClone(room),
        name: room.name.toString(),
        startType: Math.random() > 0.5 ? 'x' : 'o',
      });
    }, 2000);
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('data', data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('test')
  async test(
    @MessageBody() body,
    @ConnectedSocket() socket: Socket & { room: Room; sign: string },
  ) {
    try {
      const { isWin, event } = socket.room.check([body.x, body.y], socket.sign);
      console.log(body, socket.room);
      if (event) {
        this.server.to('game_' + socket.room.name.toString()).emit('event', {
          event: event,
        });
      }
      this.server.to('game_' + socket.room.name.toString()).emit('test', {
        room: deepClone(socket.room),
        nextType: socket.sign === 'x' ? 'o' : 'x',
        prevPoint: body,
        isWin: isWin,
        winner: isWin ? socket.sign : null,
      });
      if (isWin) {
        setTimeout(() => {
          socket.room.newEmptyBoard();
          this.startGame(socket.room);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function gameNameFormat(s: string): string {
  return 'game_' + s;
}

function deepClone(room: Room): Room {
  const newRoom = new Room({ name: room.name, o: room.o, x: room.x });
  for (let i = 0; i < room.board.length; i++) {
    for (let j = 0; j < room.board[i].length; j++) {
      newRoom.board[i][j] = room.board[i][j] === '?' ? null : room.board[i][j];
    }
  }
  return newRoom;
}
