import GMR from "graphql-merge-resolvers";
import subscriptionBook from "./book";
import subscriptionAuthor from "./author";

const subscriptionResolvers = GMR.merge(
    [subscriptionAuthor, subscriptionBook]
);

export default subscriptionResolvers;