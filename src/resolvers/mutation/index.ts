import GMR from "graphql-merge-resolvers";
import mutationBook from './book';
import mutationAuthor from './author';
import mutationUser from "./users";

const mutationResolvers = GMR.merge(
    [mutationBook, mutationAuthor, mutationUser]
);

export default mutationResolvers;