import { Test, TestingModule } from '@nestjs/testing';
import { Test1Resolver } from './test1.resolver';
import { Test1Service } from './test1.service';

describe('Test1Resolver', () => {
  let resolver: Test1Resolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Test1Resolver, Test1Service],
    }).compile();

    resolver = module.get<Test1Resolver>(Test1Resolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
