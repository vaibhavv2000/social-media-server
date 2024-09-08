import {RowDataPacket} from "mysql2";
import sql from "../../../../config/sql";
import {user} from "../../../../utils/types";
import {GraphQLError} from "graphql";

const likePost = async (_: null,{postId}: {postId: number},context: {user: user}) => {
 const {id} = context.user;
 const pool = await sql.getConnection();
 
 try {
  await pool.beginTransaction();
  const [rows] = await sql.execute(
   `SELECT liked from postInteract 
    WHERE postId = ? AND userInteracted = ? AND liked = true`,
   [postId,id]
  ) as RowDataPacket[];
 
  let isLiked = rows[0];

  if(isLiked) {
   await sql.execute(`UPDATE posts SET likes = likes - 1 WHERE id = ?`,[postId]);
   const query = `DELETE FROM postInteract WHERE postId = ? AND userInteracted = ? AND liked = true`;
   await sql.execute(query, [postId,id]);
 
   await pool.commit();
   return {message: "Post Unliked"};
  } else {
   await sql.execute(`UPDATE posts SET likes = likes + 1 WHERE id = ?`,[postId]);
   let statement = `INSERT INTO postInteract (postId, liked, userInteracted) VALUES (?, ?, ?)`;

   await sql.execute(statement, [postId,true,id]);
 
   await pool.commit();
   return {message: "Post Liked"};
  };
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 } finally {
  pool.release();
 };
};

export default likePost;