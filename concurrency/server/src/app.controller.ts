import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    console.log(time(new Date()), 'new quest');
    const res = await this.appService.getHello();
    console.log(time(new Date()), 'done');
    return res;
  }
}

function time(date: Date) {
  return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
