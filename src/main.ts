import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import config from './configs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // TODO: A supprimer peut être plus tard
  app.use(cookieParser(config().cookieSecretKey));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PFE Api')
    .setDescription('The PFE api description')
    .setVersion('1.0')
    .addTag('pfe')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();
