import {GraphQLError} from "graphql";
import sql from "../config/sql";

export const notificationTypeDefs = `#graphql

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
    get_notifications: [notification]
  }

  type Mutation {
    new_notification(action_type: ACTIONTYPE!,postId: ID,userId: ID!): notification
    delete_notification(action_type: ACTIONTYPE!,postId: ID,userId: ID!): msg
  }
`;

export const notificationResolver = {
 ACTIONTYPE: {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
 },
 Query: {
  get_notifications: async (_: any,__: any,context: any) => {
   // const { id } = context.user;
   let id = 13;

   try {
    const notifics = await sql.execute(`SELECT * FROM notifications WHERE toWhom = ?`,[id]);
    return notifics[0];
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },
 },
 Mutation: {
  new_notification: async (
   _: any,
   args: {action_type: string; postId: number; userId: number},
   context: any
  ) => {
   // const { id } = context.user;
   let id = 12;

   const {action_type,postId,userId} = args;

   try {
    if(action_type === "follow") {
     await sql.execute(
      `INSERT INTO notifications (action_type, toWhom, byWhom, postId) 
       VALUES (?,?,?,?)`,
      [action_type,userId,id,2]
     );

     return {action_type,postId,byWhom: id,toWhom: userId};
    } else {
     await sql.execute(
      `INSERT INTO notifications (action_type, toWhom, byWhom, postId) 
       VALUES (?,?,?,?)`,
      [action_type,userId,id,postId]
     );

     return {action_type,postId,byWhom: id,toWhom: userId};
    }
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  delete_notification: async (
   _: any,
   args: {action_type: string; postId: number; userId: number},
   context: any
  ) => {
   // const { id } = context.user;
   let id = 12;

   const {action_type,postId,userId} = args;

   try {
    if(action_type === "follow") {
     await sql.execute(
      `DELETE FROM notifications WHERE action_type = ? AND towhom = ? AND byWhom = ?`,
      [action_type,userId,id]
     );

     return {msg: "Notification deleted"};
    } else {
     await sql.execute(
      `DELETE FROM notifications WHERE action_type = ? AND postId = ? AND byWhom = ?`,
      [action_type,postId,userId]
     );

     return {msg: "Notification deleted"};
    }
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },
 },
};
