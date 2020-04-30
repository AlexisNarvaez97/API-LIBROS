import { IResolvers } from 'graphql-tools';
import { getBooks, getBook } from '../../lib/database-operation';

const queryBooks: IResolvers = {
  Query: {
    async books(_: void, __: any, { db }): Promise<any> {
      return await getBooks(db);
    },
    async book(_: void, { id }, { db }) {
      return await getBook(db, id);
    }
  },
};

export default queryBooks;
