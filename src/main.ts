import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiSwagger } from './swagger/api.swagger';
import { ErrorResponseFilter } from './helper/filter/errorRespone.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/v1/api');
  app.useGlobalFilters(new ErrorResponseFilter());
  app.useGlobalPipes(new ValidationPipe())

  // app.enableCors({ origin: "*" });


  ApiSwagger(app);

  await app.listen(4500);
}
bootstrap();
