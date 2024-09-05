import {GraphQLError} from "graphql";
import sql from "../../../config/sql";
import type {user} from "../../../utils/types";

interface args {
 action_type: string; 
 postId: number; 
 userId: number;
};

const newNotification = async (_: any, args: args, context: {user: user}) => {
 const {id} = context.user;
 const {action_type, postId, userId} = args;

 const query = `INSERT INTO notifications (action_type, toWhom, byWhom, postId) VALUES (?,?,?,?)`;
 const values = [action_type, userId, id, postId]
 
 try {
  await sql.execute(query, values);
  return {action_type, postId, byWhom: id, toWhom: userId};
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default newNotification;