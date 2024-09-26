import {ApolloServer} from "@apollo/server";
import merge from "lodash/merge";
import userTypeDefs from "./userSchema/userTypeDefs";
import postTypeDefs from "./postSchema/postTypeDefs";
import notificationTypeDefs from "./notificationShema/notificationTypeDefs";
import userResolver from "./userSchema/userResolver";
import postResolver from "./postSchema/postResolver";
import notificationResolver from "./notificationShema/notificationResolver";

const apolloServer = new ApolloServer({
 rootValue: {},
 typeDefs: [userTypeDefs, postTypeDefs, notificationTypeDefs],
 resolvers: merge({},userResolver, postResolver, notificationResolver),
});

export default apolloServer;