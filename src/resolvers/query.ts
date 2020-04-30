import { IResolvers } from 'graphql-tools';
import {
  getBooks,
  getAuthors,
  getAuthor,
  getBook,
  getUsers,
} from '../lib/database-operation';

import bcryptjs from 'bcryptjs';
import JWT from '../lib/jwt';

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
    async users(_: void, __: any, { db }): Promise<any> {
      return await getUsers(db);
    },
    async login(_: void, { email, password }, { db }): Promise<any> {
      const user = await db.collection('users').findOne({ email });

      if (user === null) {
        return {
          status: false,
          message: 'Login INCORRECTO. No existe el usuario',
          token: null,
        };
      }

      if (!bcryptjs.compareSync(password, user.password)) {
        return {
          status: false,
          message: 'Login INCORRECTO. Contraseña Incorrecta',
          token: null,
        };
      }

      delete user.password;
      return {
        status: true,
        message: 'Login correcto',
        token: new JWT().sign({ user }),
      };
    },
  },
};

export default query;
