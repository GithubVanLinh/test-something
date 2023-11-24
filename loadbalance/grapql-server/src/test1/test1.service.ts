import { Injectable } from '@nestjs/common';
import { CreateTest1Input } from './dto/create-test1.input';
import { UpdateTest1Input } from './dto/update-test1.input';
import { Test1 } from 'src/graphql';

@Injectable()
export class Test1Service {
  create(createTest1Input: CreateTest1Input) {
    return 'This action adds a new test1';
  }

  findAll(): Test1[] {
    return [
      {
        exampleField: 111,
      },
    ];
  }

  findOne(id: number) {
    return `This action returns a #${id} test1`;
  }

  update(id: number, updateTest1Input: UpdateTest1Input) {
    return `This action updates a #${id} test1`;
  }

  remove(id: number) {
    return `This action removes a #${id} test1`;
  }
}
