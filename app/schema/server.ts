import {ApolloServer} from "@apollo/server";
import merge from "lodash/merge";
import {userResolvers,userTypeDefs} from "./userSchema";
import {postResolver,postTypeDefs} from "./postSchema";
import {notificationResolver,notificationTypeDefs} from "./notificationSchema";

const apolloServer = new ApolloServer({
  typeDefs: [userTypeDefs,postTypeDefs,notificationTypeDefs],
  resolvers: merge({},userResolvers,postResolver,notificationResolver),
  rootValue: {
    name: "levi",
  },
});

export default apolloServer;
