import { IResolvers } from "graphql-tools";
import { CHANGE_BOOKS } from '../../config/constants';

const subscriptionBook: IResolvers = {
    Subscription : {
        changeBooks: {
            subscribe: (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(CHANGE_BOOKS);
            }
        }
    }
}

export default subscriptionBook;