import { CreateTest1Input } from './create-test1.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTest1Input extends PartialType(CreateTest1Input) {
  id: number;
}
