import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

interface args {
 comment: string;
 postId: number;
};

const deleteComment = async (_: any,args: args) => {
 const {comment,postId,} = args;
 const pool = await sql.getConnection();
 let query = `DELETE FROM postinteract WHERE postId = ? AND comment = ?`;
 
 try {
  await pool.beginTransaction();
  await sql.execute(query, [postId,comment]);
 
  await sql.execute(`UPDATE posts SET comments = comments - 1 WHERE id = ?`, [postId]);
 
  await pool.commit();
  return {message: "Comment Deleted"};
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 }
};

export default deleteComment;