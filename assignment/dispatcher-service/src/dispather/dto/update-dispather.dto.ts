import { PartialType } from '@nestjs/mapped-types';
import { CreateDispatherDto } from './create-dispather.dto';

export class UpdateDispatherDto extends PartialType(CreateDispatherDto) {
  id: number;
}
