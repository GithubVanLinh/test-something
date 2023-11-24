import { Controller, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TEST2_SERVICE') private readonly test2Service: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'get_hello' })
  async getHello() {
    console.log('get hello');
    try {
      const responseData = this.appService.getHello();
      const resp = await lastValueFrom(
        this.test2Service.send({ cmd: 'get_hello' }, {}).pipe(timeout(5000)),
      );
      console.log('HELLO_SERVICE:', responseData);
      return responseData + '/' + resp;
    } catch (e) {
      console.log('error', e);
      return 'not available';
    }
  }
}
