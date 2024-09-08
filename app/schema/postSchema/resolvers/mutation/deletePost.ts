import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import {removeImage} from "../../../../config/upload";
import {user} from "../../../../utils/types";

interface args {
 postId: number;
 photo: string;
};

const deletePost  = async (_: any,args: args,context: {user: user}) => {
 const {id} = context.user;
 const {postId, photo} = args;
 
 const pool = await sql.getConnection();
 try {
  await pool.beginTransaction();
  await sql.execute(`DELETE FROM posts WHERE id = ? AND userId = ?`,[postId,id]);
  await sql.execute(`UPDATE users SET posts = posts - 1 WHERE id = ?`,[id])

  await pool.commit();
  if(photo) removeImage(photo);
  return {message: "Post deleted"};
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 };
};

export default deletePost;