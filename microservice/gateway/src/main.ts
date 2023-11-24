import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('GATEWAY IS RUNNING ON PORT 3456');
  app.startAllMicroservices();
  await app.listen(3456);
}
bootstrap();
