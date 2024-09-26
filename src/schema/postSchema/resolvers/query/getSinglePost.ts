import type {RowDataPacket} from "mysql2";
import sql from "../../../../config/sql";
import type {post, user} from "../../../../utils/types";
import {GraphQLError} from "graphql";

const getSinglePost = async (_: null,{postId}: {postId: number}, {user}: {user: user}) => {
 const {id} = user;

 try {
  const [posts] = await sql.query(
   `SELECT p.*,u.name,u.username,u.profile FROM posts p 
    INNER JOIN  
    users u ON p.userId = u.id
    WHERE p.id = ?
   `,
   [postId]
  ) as RowDataPacket[];
 
  let post = posts[0] as post;

  if(!post) {
   throw new GraphQLError("No post found",{
    extensions: {
     http: {status: 404},
     code: "NOT_FOUND",
    },
   });
  };

  let query = `SELECT liked FROM postinteract WHERE postId = ? AND userInteracted = ? AND (liked = true)`;

  const [rows] = await sql.query(query, [post.id, id]) as RowDataPacket[];
  let isLiked = rows[0] ? true: false;

  let statement = `SELECT id FROM bookmarks WHERE postId = ? AND bookmarkedBy = ?`;

  const [bookmarks]= await sql.query(statement, [post.id, id]) as RowDataPacket[];
  let isBookmarked = bookmarks[0] ? true: false;

  return {isLiked, isBookmarked, ...post};
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getSinglePost;