
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateTest1Input {
    exampleField?: Nullable<number>;
}

export class UpdateTest1Input {
    id: number;
}

export class Book {
    id?: Nullable<number>;
    title?: Nullable<string>;
    author?: Nullable<Author>;
}

export class Author {
    id?: Nullable<number>;
    name?: Nullable<string>;
    books?: Nullable<Nullable<Book>[]>;
}

export abstract class IQuery {
    abstract books(): Nullable<Nullable<Book>[]> | Promise<Nullable<Nullable<Book>[]>>;

    abstract book(id: number): Nullable<Book> | Promise<Nullable<Book>>;

    abstract authors(): Nullable<Nullable<Author>[]> | Promise<Nullable<Nullable<Author>[]>>;

    abstract posts(): Nullable<Book> | Promise<Nullable<Book>>;

    abstract test1s(): Nullable<Test1>[] | Promise<Nullable<Test1>[]>;

    abstract test1(id: number): Nullable<Test1> | Promise<Nullable<Test1>>;
}

export abstract class IMutation {
    abstract addBook(title?: Nullable<string>, author?: Nullable<string>): Nullable<Book> | Promise<Nullable<Book>>;

    abstract createAuthor(id?: Nullable<number>, name?: Nullable<string>): Nullable<Author> | Promise<Nullable<Author>>;

    abstract createTest1(createTest1Input: CreateTest1Input): Test1 | Promise<Test1>;

    abstract updateTest1(updateTest1Input: UpdateTest1Input): Test1 | Promise<Test1>;

    abstract removeTest1(id: number): Nullable<Test1> | Promise<Nullable<Test1>>;
}

export class Test1 {
    exampleField?: Nullable<number>;
}

type Nullable<T> = T | null;
