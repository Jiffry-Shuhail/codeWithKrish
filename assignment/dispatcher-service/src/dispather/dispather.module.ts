import { Module } from '@nestjs/common';
import { DispatherService } from './dispather.service';
import { DispatherController } from './dispather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispather } from './entities/dispather.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Dispather])],
  controllers: [DispatherController],
  providers: [DispatherService],
})
export class DispatherModule {}
