import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_hello' })
  getHello(): string {
    console.log('get hello');
    const responseData = this.appService.getHello();
    console.log('HELLO_SERVICE:', responseData);
    return responseData;
  }
}
