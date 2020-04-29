import { IResolvers } from 'graphql-tools';
import { Datetime } from '../lib/datetime';
import { getBooks, getAuthors } from '../lib/database-operation';

const mutation: IResolvers = {
    Mutation: {
      async registerBook(_: void, { book }, { db, pubsub }): Promise<any> {
        // Comprobacion que no se repita.
        // const bookCheck = await db.collection('books').findOne({ email: book.email});
  
        // if (bookCheck !== null) {
        //   return {
        //     status: false,
        //     message: 'Ya existe el usuario',
        //     book: null
        //   }
        // }
  
        const lastBook = await db
          .collection("books")
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
          .collection("books")
          .insertOne(book)
          .then((result: any) => {
            return {
              status: true,
              message: `Libro ${book.name} añadido correctamente`,
              book
            };
          })
          .catch((err: any) => {
            return {
              status: false,
              message: `Libro NO añadido correctamente`,
              book: null
            };
          });
      },
      async registerAuthor(_: void, { author }, { db, pubsub }) {

        console.log(author);
  
        const authorCheck = await db
          .collection("authors")
          .findOne({ email: author.email });
  
        if (authorCheck !== null) {
          return {
            status: false,
            message: `Ya existe el usuario con el email ${author.email}`,
            book: null
          };
        }
  
        const lastAuthor = await db
          .collection("authors")
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
          .collection("authors")
          .insertOne(author)
          .then((result: any) => {
            return {
              status: true,
              message: `Autor ${author.name} añadido correctamente`,
              author
            };
          })
          .catch((err: any) => {
            return {
              status: false,
              message: `Autor NO añadido correctamente`,
              author: null
            };
          });
      },
      async updateBook(_: void, { id, updateBook }, { db, pubsub }) {
        return await db
          .collection("books")
          .updateOne(
            { id },
            {
              $set: {
                name: updateBook.name,
                editorial: updateBook.editorial,
                author_id: updateBook.author_id,
                year: updateBook.year,
                language: updateBook.language
              }
            }
          )
          .then(async () => {
            return {
              status: true,
              message: "Libro actualizado",
              book: updateBook
            };
          })
          .catch(async () => {
            return {
              status: false,
              message: "Falso",
              book: null
            };
          });
      },
      async updateAuthor(_: void, { id, updateAuthor }, { db, pubsub }) {
  
        console.log(updateAuthor);
  
        return await db
          .collection("authors")
          .updateOne(
            { id },
            {
              $set: {
                name: updateAuthor.name,
                lastname: updateAuthor.lastname
              }
            }
          )
          .then(async () => {
            return {
              status: true,
              message: "Autor actualizado",
              author: updateAuthor
            };
          })
          .catch(async () => {
            return {
              status: false,
              message: "Ocurrio un error en actualizarlo",
              author: null
            };
          });
  
      },
      async deleteBook(_: void, {id }, {db, pubsub}) {
        return await db.collection("books").deleteOne({id}).then( async () => {
          return {
            status: true,
            message: `El libro con el ID ${id} ha sido borrado`
          }
        }).
        catch( async () => {
          return {
            status: false,
            message: `Ha ocurrido un error en la eliminación`
          }
        })
      },
      async deleteAuthor(_: void, { id }, {db, pubsub}) {
        return await db.collection("authors").deleteOne({id}).then( async () => {
          return {
            status: true,
            message: `El author con el ID ${id} ha sido borrado`
          };
        }).
        catch( async () => {
          return {
            status: false,
            message: `Ha ocurrido un error en la eliminación`
          };
        });
      }
    }
  };
  
  export default mutation;
  