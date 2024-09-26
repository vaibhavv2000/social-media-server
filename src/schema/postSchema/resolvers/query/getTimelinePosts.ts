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

  let query = `SELECT liked FROM postinteract WHERE postId = ? AND userInteracted = ? AND (liked = true OR bookmarked = true)`;

  const posts = await Promise.all(rows.map(async (item: post) => {
   const [rows] = await sql.query(query, [item.id, id]) as RowDataPacket[];
   let isLiked = rows[0] ? true: false;
   return {...item, isLiked};
  }));

  let statement = `SELECT id FROM bookmarks WHERE postId = ? AND bookmarkedBy = ?`;

  const items = await Promise.all(posts.map(async (item: post) => {
   const [rows]= await sql.query(statement, [item.id, id]) as RowDataPacket[];
   let isBookmarked = rows[0] ? true: false;
   return {...item, isBookmarked};
  }))

  return items;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 }
};

export default getTimelinePosts;