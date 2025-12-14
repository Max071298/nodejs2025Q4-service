"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv = require("dotenv");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
dotenv.config();
const configService = new config_1.ConfigService();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: parseInt(configService.get('POSTGRES_PORT')),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
    entities: [__dirname + '/**/entities/*.entity.{ts,js}'],
    migrations: [__dirname + '/**/migrations/*.{ts,js}'],
    migrationsTableName: 'migration_table',
    synchronize: false,
    migrationsRun: true,
    dropSchema: false,
});
//# sourceMappingURL=typeorm.config.js.map