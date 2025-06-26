import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '192.168.0.3',
  port: +process.env.PORT! || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'lionheart',
  database: process.env.DB_NAME || 'sistemafinanciero',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
};