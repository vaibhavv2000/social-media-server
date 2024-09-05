import type {RowDataPacket} from "mysql2";
import sql from "../../../../config/sql";
import {post} from "../../../../utils/types";
import {GraphQLError} from "graphql";

const getSinglePost = async (_: null,{postId}: {postId: number}) => {
 try {
  const [rows] = await sql.query(
   `SELECT p.*,u.name,u.username,u.profile FROM posts p 
    INNER JOIN  
    users u ON p.userId = u.id
    WHERE p.id = ?
   `,
   [postId]
  ) as RowDataPacket[];
 
  let post = rows[0] as post;
 
  if(!post) {
   throw new GraphQLError("No post found",{
    extensions: {
     http: {status: 404},
     code: "NOT_FOUND",
    },
   });
  };

  return post;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getSinglePost;