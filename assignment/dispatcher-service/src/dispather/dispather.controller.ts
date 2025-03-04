import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DispatherService } from './dispather.service';
import { CreateDispatherDto } from './dto/create-dispather.dto';
import { UpdateDispatherDto } from './dto/update-dispather.dto';
import { Dispather } from './entities/dispather.entity';

@Controller('dispatch-locations')
export class DispatherController {
  constructor(private readonly dispatherService: DispatherService) {}

  @Post()
  async create(@Body() createDispatherDto: CreateDispatherDto):Promise<Dispather|null> {
    return await this.dispatherService.create(createDispatherDto);
  }

  @Get()
  async findAll():Promise<Dispather[]|[]> {
    return await this.dispatherService.findAll();
  }

  @Get(':city')
  async findOne(@Param('city') city: string):Promise<Dispather[]|[]> {
    return await this.dispatherService.findOne(city);
  }
}
