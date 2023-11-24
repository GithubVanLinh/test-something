import { Module } from '@nestjs/common';
import { Test1Service } from './test1.service';
import { Test1Resolver } from './test1.resolver';

@Module({
  providers: [Test1Resolver, Test1Service],
})
export class Test1Module {}
