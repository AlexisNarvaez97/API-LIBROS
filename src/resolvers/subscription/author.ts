import { IResolvers } from "graphql-tools";
import { CHANGE_AUTHORS } from '../../config/constants';

const subscriptionAuthor: IResolvers = {
    Subscription : {
        changeAuthors: {
            subscribe: (_: void, __: any, { pubsub }) => {
                return pubsub.asyncIterator(CHANGE_AUTHORS);
            }
        }
    }
}

export default subscriptionAuthor;