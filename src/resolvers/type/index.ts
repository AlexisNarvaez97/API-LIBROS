import GMR from "graphql-merge-resolvers";
import typeBook from './book';

const typeResolvers = GMR.merge(
    [typeBook]
);

export default typeResolvers;