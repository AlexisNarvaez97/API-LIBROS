import { IResolvers } from 'graphql-tools';
import { Datetime } from '../lib/datetime';
import { getBooks, getAuthors, getAuthor } from '../lib/database-operation';
import { CHANGE_AUTHORS, CHANGE_BOOKS } from '../config/constants';

import bcryptjs from 'bcryptjs';

async function sendNotificationAuthors(pubsub: any, db: any) {
  pubsub.publish(CHANGE_AUTHORS, { changeAuthors: await getAuthors(db)});
}

async function sendNotificationBooks(pubsub: any, db: any) {
  pubsub.publish(CHANGE_BOOKS, { changeBooks: await getBooks(db)});
}

const mutation: IResolvers = {
  Mutation: {
    async registerBook(_: void, { book }, { db, pubsub }): Promise<any> {
      const authors: [] = await getAuthors(db);

      for (const author of authors) {
        const { id } = author;
        if (id != book.author_id) {
          return {
            status: false,
            message: 'No existe un autor con ese ID para agregar al libro',
          };
        }

        const lastBook = await db
          .collection('books')
          .find()
          .limit(1)
          .sort({ registerDate: -1 })
          .toArray();

        if (lastBook.length === 0) {
          book.id = 1;
        } else {
          book.id = lastBook[0].id + 1;
        }
        book.registerDate = new Datetime().getCurrentDateTime();
        return await db
          .collection('books')
          .insertOne(book)
          .then((result: any) => {
            sendNotificationBooks(pubsub, db);
            return {
              status: true,
              message: `Libro ${book.name} añadido correctamente`,
              book,
            };
          })
          .catch((err: any) => {
            return {
              status: false,
              message: `Libro NO añadido correctamente`,
              book: null,
            };
          });
      }
    },
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
    async updateBook(_: void, { id, updateBook }, { db, pubsub }) {
      const books = await getBooks(db);

      for (const book of books) {
        const { id: bookId } = book;

        if (bookId !== id) {
          return {
            status: false,
            message: 'No existe un libro con ese id',
          };
        }

        return await db
          .collection('books')
          .updateOne(
            { id },
            {
              $set: {
                name: updateBook.name,
                editorial: updateBook.editorial,
                author_id: updateBook.author_id,
                year: updateBook.year,
                language: updateBook.language,
              },
            }
          )
          .then(async () => {
            sendNotificationBooks(pubsub, db);
            return {
              status: true,
              message: 'Libro actualizado',
              book: updateBook,
            };
          })
          .catch(async () => {
            return {
              status: false,
              message: 'Falso',
              book: null,
            };
          });
      }
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
    async deleteBook(_: void, { id }, { db, pubsub }) {
      return await db
        .collection('books')
        .deleteOne({ id })
        .then(async () => {
          sendNotificationBooks(pubsub, db);
          return {
            status: true,
            message: `El libro con el ID ${id} ha sido borrado`,
          };
        })
        .catch(async () => {
          return {
            status: false,
            message: `Ha ocurrido un error en la eliminación`,
          };
        });
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
    },
    async register(_: void, { user }, { db }): Promise<any> {
      const userCheck = await db.collection('users').findOne({email: user.email});

      if (userCheck !== null) {
        return {
          status: false,
          message: `Usuario ya existe`,
          user: null
        }
      }
      const lastUser = await db
        .collection("users")
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();

      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        user.id = lastUser[0].id + 1;
      }
      user.password = bcryptjs.hashSync(user.password, 10);
      user.registerDate = new Datetime().getCurrentDateTime();
      return await db
        .collection("users")
        .insertOne(user)
        .then((result: any) => {
          return {
            status: true,
            message: `Usuario ${user.name} ${user.lastname} añadido correctamente`,
            user
          };
        })
        .catch((err: any) => {
          return {
            status: false,
            message: `Usuario NO añadido correctamente`,
            user: null
          };
        });
    }
  },
};

export default mutation;
