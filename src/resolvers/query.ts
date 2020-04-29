import { IResolvers } from 'graphql-tools';
import { getBooks, getAuthors, getAuthor, getBook } from '../lib/database-operation';

const query: IResolvers = {
    Query: {
        async books(_: void, __: any, { db }): Promise<any> {
            return await getBooks(db);
          },
          async authors(_: void, __: any, { db }): Promise<any> {
            return await getAuthors(db);
          },
          async author(_: void, { id }, { db }) {
            return await getAuthor(db, id);
          },
          async book(_: void, { id }, { db }) {
            return await getBook(db, id);
          },
    }
};

export default query;