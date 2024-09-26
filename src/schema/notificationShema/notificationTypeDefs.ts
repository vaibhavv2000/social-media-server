const notificationTypeDefs = `#graphql

 enum ACTIONTYPE {
  LIKE
  FOLLOW
  COMMENT
 }
 
 type notification {
  action_type: ACTIONTYPE
  toWhom: ID
  byWhom: ID
  postId: ID
 }

 type msg {
  msg: String
 }

 type Query {
  getNotifications: [notification]
 }

 type Mutation {
  newNotification(action_type: ACTIONTYPE!,postId: ID,userId: ID!): notification
  deleteNotification(action_type: ACTIONTYPE!,postId: ID,userId: ID!): msg
 }
`;

export default notificationTypeDefs;