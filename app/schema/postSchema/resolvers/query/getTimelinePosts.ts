import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {RowDataPacket} from "mysql2";
import type {post, user} from "../../../../utils/types";

const getTimelinePosts = async (_: null, args: null, context: {user: user}) => {
 const {id} = context.user;
 
 try {
  const [rows] = await sql.execute(
   `SELECT p.*,u.name,u.username,u.profile FROM posts p 
    INNER JOIN users u ON p.userid = u.id 
    WHERE userId IN (SELECT followingId FROM followings WHERE followerId = ?) 
    UNION ALL 
    SELECT posts.*,users.name,users.username,users.profile FROM posts 
    INNER JOIN users ON posts.userId = users.id WHERE userid = ?
    ORDER BY id DESC
   `,
   [id,id]
  ) as RowDataPacket[];

  let query = `SELECT * FROM postinteract WHERE postId = ? AND userInteracted = ?`;
 
  const posts = await Promise.all(rows.map(async (item: post) => {
   const [rows] = await sql.query(query,[item.id, id]) as RowDataPacket[];
   return {...item, isLiked: rows[0] ? true: false};
  }));

  return posts;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 }
};

export default getTimelinePosts;