import { IResolvers } from 'graphql-tools';
import bcryptjs from 'bcryptjs';
import { getUsers } from '../../lib/database-operation';
import JWT from '../../lib/jwt';

const queryUsers: IResolvers = {
  Query: {
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
    me(_: void, __: any, { token }) {
      let info: any = new JWT().verify(token);
      if (
        info ===
        "La autenticación del token es inválida, por favor inicia sesion para obtener un nuevo token"
      ) {
        return {
          status: false,
          message: info,
          user: null
        };
      }
      return {
        status: true,
        message: "Token correcto",
        user: info.user
      };
    }
  },
};

export default queryUsers;
