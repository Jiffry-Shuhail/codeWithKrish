import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/entities/customer.entity';
@Module({
  imports: [CustomersModule,TypeOrmModule.forRoot({
    type:'mysql',
    host:process.env.HOSTNAME || 'localhost',
    port:3306,
    username:'root',
    password:'admin',
    database:'cosmos',
    entities:[Customer],
    synchronize:true //Dont use production | only on dev
  })]
})
export class AppModule {}
