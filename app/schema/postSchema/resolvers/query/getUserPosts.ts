import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {post, user} from "../../../../utils/types";
import {RowDataPacket} from "mysql2";

const getUserPosts = async (_: null,args: {username: string},{user}: {user: user}) => {
 const {username} = args;
 const {id} = user;
 
 let q = `SELECT p.*,u.name,u.username,u.profile FROM posts p 
  INNER JOIN users u ON p.userId = u.id 
  WHERE p.userId = (select id FROM users WHERE username = ?)`;
  
 try {
  const [rows] = await sql.query(q,[username]) as RowDataPacket[];

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

export default getUserPosts;