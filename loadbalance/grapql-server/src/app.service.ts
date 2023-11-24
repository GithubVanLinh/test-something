import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Root,
} from '@nestjs/graphql';
import { Author, Book } from './graphql';
import { authors, books } from './database.mock';
import { Logger } from '@nestjs/common';

@Resolver('Book')
export class BookResolver {
  logger = new Logger(BookResolver.name);
  @Query(() => [Book], { name: 'books' })
  getBooks(@Args() ar): Book[] {
    this.logger.debug(ar);
    return books;
  }

  @ResolveField('title')
  title(@Args() argv, @Root() r: Book): string {
    this.logger.debug(r);
    // this.logger.debug(c, 'c');
    return argv.hello + ': ' + r.title;
  }

  @Query()
  book(@Args() argv): Book {
    this.logger.log(argv);
    const id = argv.id;

    return books.find((b) => b.id === id);
  }

  // @ResolveField()
  // async books(@Parent() author) {
  //   console.log('author', author);
  //   const { id } = author;
  //   return books.find((b) => (b.author.id = id));
  // }

  @Mutation()
  createAuthor(@Args() author) {
    authors.push({ ...author });
    return author;
  }
}

@Resolver('Author')
export class AuthorResolver {
  logger = new Logger(AuthorResolver.name);

  @ResolveField('books', () => [Book])
  books(@Parent() author: Author) {
    this.logger.debug(author);
    const id = author.id;

    return books.filter((b) => b.author.id === id);
  }

  @Query(() => [Author])
  authors(): Author[] {
    return authors;
  }
}
