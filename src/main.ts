import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs/promises';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const config = new DocumentBuilder().setTitle('Home').build();
  const openAPIYaml = await fs.readFile('doc/api.yaml', 'utf8');
  const documentFactory = yaml.load(openAPIYaml) as OpenAPIObject;
  SwaggerModule.setup('api', app, documentFactory);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);
}
bootstrap();
