import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [ProductModule ,TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port:3306,
    username:'root',
    password:'admin',
    database:'cosmos',
    entities:[Product],
    synchronize:true //Dont use production | only on dev
  })]
})
export class AppModule {}
