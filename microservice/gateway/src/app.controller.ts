import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('TEST_SERVICE') private readonly testService: ClientProxy,
  ) {}

  @Get()
  async getHello() {
    console.log('get hello from gateway');
    return lastValueFrom(this.testService.send({ cmd: 'get_hello' }, {}));
  }
}
