import { IResolvers } from "graphql-tools";
import { CHANGE_AUTHORS, CHANGE_BOOKS } from '../config/constants';

const subscription : IResolvers = {
    Subscription : {
        changeAuthors: {
            subscribe: (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(CHANGE_AUTHORS);
            }
        },
        changeBooks: {
            subscribe: (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(CHANGE_BOOKS);
            }
        }
    }
}

export default subscription;