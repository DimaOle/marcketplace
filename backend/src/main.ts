import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3002;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(PORT);
  console.log(`Server working in PORT - ${PORT}`);
}
bootstrap();
