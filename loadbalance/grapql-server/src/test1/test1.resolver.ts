import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Test1Service } from './test1.service';
import { CreateTest1Input } from './dto/create-test1.input';
import { UpdateTest1Input } from './dto/update-test1.input';

@Resolver('Test1')
export class Test1Resolver {
  constructor(private readonly test1Service: Test1Service) {}

  @Mutation('createTest1')
  create(@Args('createTest1Input') createTest1Input: CreateTest1Input) {
    return this.test1Service.create(createTest1Input);
  }

  @Query('test1s')
  findAll() {
    return this.test1Service.findAll();
  }

  @Query('test1')
  findOne(@Args('id') id: number) {
    return this.test1Service.findOne(id);
  }

  @Mutation('updateTest1')
  update(@Args('updateTest1Input') updateTest1Input: UpdateTest1Input) {
    return this.test1Service.update(updateTest1Input.id, updateTest1Input);
  }

  @Mutation('removeTest1')
  remove(@Args('id') id: number) {
    return this.test1Service.remove(id);
  }
}
