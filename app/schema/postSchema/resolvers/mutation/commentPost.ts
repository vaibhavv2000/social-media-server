import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

const commentPost = async (_: any,args: {postId: number; comment: string},context: any) => {
 const {postId, comment} = args;
 const {id} = context.user;
 const pool = await sql.getConnection();
 const query = `INSERT INTO postInteract (postId, comment, userInteracted) VALUES (?, ?, ?)`;
 
 try {
  await pool.beginTransaction();
  await sql.execute(query, [postId,comment,id]);
 
  await sql.execute(`UPDATE posts SET comments = comments + 1 WHERE id = ?`, [postId]);
 
  await pool.commit();
  return {message: "Commented"};
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 };
};

export default commentPost;