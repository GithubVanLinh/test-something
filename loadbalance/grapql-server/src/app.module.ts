import * as path from 'path';
import { Module } from '@nestjs/common';
import { AuthorResolver, BookResolver } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Test1Module } from './test1/test1.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql', './src/**/*.graphql'],
      definitions: {
        path: path.join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    Test1Module,
  ],
  controllers: [],
  providers: [BookResolver, AuthorResolver],
})
export class AppModule {}
