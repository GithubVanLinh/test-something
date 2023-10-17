import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World From Server ${process.env.SERVER_NAME}!`;
  }
}
