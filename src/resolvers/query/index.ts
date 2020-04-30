import GMR from "graphql-merge-resolvers";
import queryBooks from "./book";
import queryUsers from "./user";
import queryAuthors from './author';


const resolversQuery = GMR.merge(
    [
        queryBooks,
        queryUsers,
        queryAuthors
    ]
);

export default resolversQuery;