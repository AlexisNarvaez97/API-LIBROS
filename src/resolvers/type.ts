import { IResolvers } from 'graphql-tools';
import { getAuthors } from '../lib/database-operation';

const type: IResolvers = {
    Book: {
      author: async function(parent: any, __: any, { db }) {
        let listaAutor: Array<any> = [];
        const authors: [] = await getAuthors(db);
  
        authors.filter((author: any) => {
          if (author.id == parent.author_id) {
            listaAutor.push(author);
          }
        });
        return listaAutor;
      }
    }
  };
  
  export default type;
  