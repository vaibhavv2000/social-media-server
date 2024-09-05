const userTypeDefs = `#graphql

 interface User_types {
  id: ID
  name: String
  username: String
  email: String
  profile: String
 }

 type User {
  id: ID
  name: String
  username: String
  profile: String
  email: String
  bio: String
  cover: String
  posts: Int
  followers: Int
  followings: Int
 }

 type user_data implements User_types {
  id: ID
  name: String
  username: String
  email: String
  bio: String
  profile: String
  cover: String
  posts: Int
  followers: Int
  followings: Int
  isFollowing: Boolean
 }

 type msg {
  msg: String
 }

 type Query {
  getUser(username: String!): user_data
  getRecommendedUsers(query: String): [User]
  getUserData: User
 }

 type Mutation {
  updateUser(name: String, username: String, email: String, password: String, bio: String, profile: String, cover: String): User
  followUser(userId: ID!): msg
 }
`;

export default userTypeDefs;