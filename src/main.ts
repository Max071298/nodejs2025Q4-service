import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { CustomLogger } from './logger/logger.service';
import { HttpExceptionFilter } from './logger/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(new CustomLogger());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  try {
    const openAPIYaml = await fs.readFile('doc/api.yaml', 'utf8');
    const documentFactory = yaml.load(openAPIYaml) as OpenAPIObject;
    SwaggerModule.setup('api', app, documentFactory);
  } catch (err) {
    console.warn('Swagger doc not available at doc/api.yaml, skipping setup.');
  }
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}
bootstrap();
