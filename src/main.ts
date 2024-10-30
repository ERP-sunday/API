import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import config from './configs/config';
import { HttpExceptionFilter } from 'src/common/filters/http.exception.filter';
import * as process from 'process';

async function bootstrap() {
  const port = process.env.PORT || 4000;
  const frontUrl = process.env.FRONT_URL || 'http://localhost:3000';
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: frontUrl,
    credentials: true,
  });
  app.use(cookieParser(config().cookieSecretKey));

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tabbeo Api')
    .setDescription('The Tabbeo api description')
    .setVersion('1.0')
    .addTag('pfe')
    .addCookieAuth('jwt')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(port);
}
bootstrap();
