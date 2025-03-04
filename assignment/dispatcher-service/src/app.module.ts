import { Module } from '@nestjs/common';
import { DispatherModule } from './dispather/dispather.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispather } from './dispather/entities/dispather.entity';
@Module({
  imports: [DispatherModule,TypeOrmModule.forRoot({
    type:'mysql',
    host:process.env.HOSTNAME || 'localhost',
    port:3306,
    username:'root',
    password:'admin',
    database:'cosmos',
    entities:[Dispather],
    synchronize:true //Dont use production | only on dev
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
