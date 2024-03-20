import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiSwagger } from './swagger/api.swagger';
import { ErrorResponseFilter } from './helper/filter/errorRespone.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorResponseFilter());

  // app.enableCors({ origin: "*" });


  ApiSwagger(app);

  await app.listen(4500);
}
bootstrap();
