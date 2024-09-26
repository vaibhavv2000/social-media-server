import followUser from "./resolvers/mutation/followUser";
import updateUser from "./resolvers/mutation/updateUser";
import getRecommendedUsers from "./resolvers/query/getRecommendedUsers";
import getUser from "./resolvers/query/getUser";
import getUserData from "./resolvers/query/getUserData";

const userResolver = {
 Query: {
  getUser,
  getRecommendedUsers,
  getUserData,
 },
 Mutation: {
  followUser,
  updateUser,
 },
};

export default userResolver;