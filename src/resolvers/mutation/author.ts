import { IResolvers } from 'graphql-tools';
import { CHANGE_AUTHORS } from '../../config/constants';
import { Datetime } from '../../lib/datetime';
import { getAuthors } from '../../lib/database-operation';

async function sendNotificationAuthors(pubsub: any, db: any) {
  pubsub.publish(CHANGE_AUTHORS, { changeAuthors: await getAuthors(db)});
}

const mutationAuthor: IResolvers = {
  Mutation: {
    async registerAuthor(_: void, { author }, { db, pubsub }) {
      // console.log(author);

      const authorCheck = await db
        .collection('authors')
        .findOne({ email: author.email });

      if (authorCheck !== null) {
        return {
          status: false,
          message: `Ya existe el usuario con el email ${author.email}`,
          book: null,
        };
      }

      const lastAuthor = await db
        .collection('authors')
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();

      if (lastAuthor.length === 0) {
        author.id = 1;
      } else {
        author.id = lastAuthor[0].id + 1;
      }

      author.registerDate = new Datetime().getCurrentDateTime();
      return await db
        .collection('authors')
        .insertOne(author)
        .then((result: any) => {
          sendNotificationAuthors(pubsub, db);
          return {
            status: true,
            message: `Autor ${author.name} añadido correctamente`,
            author,
          };
        })
        .catch((err: any) => {
          return {
            status: false,
            message: `Autor NO añadido correctamente`,
            author: null,
          };
        });
    },
    async updateAuthor(_: void, { id, updateAuthor }, { db, pubsub }) {
      const authors = await getAuthors(db);

      for (const author of authors) {
        const { id: authorId } = author;

        if (authorId !== id) {
          return {
            status: false,
            message: 'No existe un autor con ese id',
          };
        }

        return await db
          .collection('authors')
          .updateOne(
            { id },
            {
              $set: {
                name: updateAuthor.name,
                lastname: updateAuthor.lastname,
              },
            }
          )
          .then(async () => {
            sendNotificationAuthors(pubsub, db);
            return {
              status: true,
              message: 'Autor actualizado',
              author: updateAuthor,
            };
          })
          .catch(async () => {
            return {
              status: false,
              message: 'Ocurrio un error en actualizarlo',
              author: null,
            };
          });
      }
    },
    async deleteAuthor(_: void, { id }, { db, pubsub }) {
      return await db
        .collection('authors')
        .deleteOne({ id })
        .then(async () => {
          sendNotificationAuthors(pubsub, db);
          return {
            status: true,
            message: `El author con el ID ${id} ha sido borrado`,
          };
        })
        .catch(async () => {
          return {
            status: false,
            message: `Ha ocurrido un error en la eliminación`,
          };
        });
    }
  },
};

export default mutationAuthor;
