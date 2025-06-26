import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { ComprobantesModule } from './comprobantes/comprobantes.module';
import { ConfigModule } from '@nestjs/config';
import { NetworkModule } from './network/network.module';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ComprobantesModule,
    FileModule,
    NetworkModule,
  ],
})
export class AppModule { }
