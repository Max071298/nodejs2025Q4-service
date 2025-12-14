import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

dotenv.config();
const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: parseInt(configService.get<string>('POSTGRES_PORT')),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
  entities: [__dirname + '/**/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/**/migrations/*.{ts,js}'],
  migrationsTableName: 'migration_table',
  synchronize: false,
  migrationsRun: true,
  dropSchema: false,
});
