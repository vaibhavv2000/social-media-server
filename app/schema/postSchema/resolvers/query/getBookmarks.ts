import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {post, user} from "../../../../utils/types";
import type {RowDataPacket} from "mysql2";

const getBookmarks = async (_: null, __: null, {user: {id}}: {user: user}) => {
 try {
  const [rows] = await sql.query(
   `SELECT p.*, u.name,u.username,u.profile FROM posts p
    INNER JOIN users u ON p.userId = u.id
    WHERE p.id in (SELECT postId from bookmarks WHERE bookmarkedBy = ?)`,[id]
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
 };
};

export default getBookmarks;