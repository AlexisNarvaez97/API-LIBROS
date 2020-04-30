import { IResolvers } from 'graphql-tools';
import { getAuthors, getAuthor } from '../../lib/database-operation';

const queryAuthors: IResolvers = {
  Query: {
    async authors(_: void, __: any, { db }): Promise<any> {
      return await getAuthors(db);
    },
    async author(_: void, { id }, { db }) {
      return await getAuthor(db, id);
    }
  },
};

export default queryAuthors;
