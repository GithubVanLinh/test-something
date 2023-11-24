import { Author, Book } from './graphql';

const authors: Author[] = [
  {
    id: 1,
    name: 'vl',
  },
  {
    id: 2,
    name: 'vl2',
  },
];

const books: Book[] = [
  {
    id: 1,
    title: 'hehe',
    author: {
      id: 1,
      name: 'vl',
    },
  },
  {
    id: 2,
    title: 'hehehe',
    author: {
      id: 2,
      name: 'vl2',
    },
  },
  {
    id: 3,
    title: 'hehe3',
    author: {
      id: 2,
      name: 'vl2',
    },
  },
];

export { books, authors };
