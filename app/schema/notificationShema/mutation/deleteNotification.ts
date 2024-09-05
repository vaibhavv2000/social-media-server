import {GraphQLError} from "graphql";
import sql from "../../../config/sql";
import {user} from "../../../utils/types";

interface args {
 action_type: string; 
 postId: number; 
 userId: number;
};

const deleteNotification = async (_: null, args: args, context: {user: user}) => {
 const {id} = context.user;
 const {action_type, postId, userId} = args;
 
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
 } catch(error: any) {
  throw new GraphQLError(error.message);
 }
};

export default deleteNotification;