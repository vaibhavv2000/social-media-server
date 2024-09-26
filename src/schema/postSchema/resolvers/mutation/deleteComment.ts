import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

interface args {
 id: string;
 postId: number;
};

const deleteComment = async (_: null,args: args) => {
 const {id, postId} = args;
 const pool = await sql.getConnection();
 let query = `DELETE FROM postinteract WHERE id = ?`;
 
 try {
  await pool.beginTransaction();
  await sql.execute(query, [id]);
 
  await sql.execute(`UPDATE posts SET comments = comments - 1 WHERE id = ?`, [postId]);
  await pool.commit();
  return {message: "Comment Deleted"};
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 } finally {
  pool.release();  
 };
};

export default deleteComment;