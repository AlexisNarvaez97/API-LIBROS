import { IResolvers } from 'graphql-tools';
import { CHANGE_BOOKS } from '../../config/constants';
import { getBooks, getAuthors } from '../../lib/database-operation';
import { Datetime } from '../../lib/datetime';

async function sendNotificationBooks(pubsub: any, db: any) {
  pubsub.publish(CHANGE_BOOKS, { changeBooks: await getBooks(db)});
}

const mutationBook: IResolvers = {
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
    }
  },
};

export default mutationBook;
