import {RowDataPacket} from "mysql2";
import sql from "../../../../config/sql";
import {user} from "../../../../utils/types";
import {GraphQLError} from "graphql";

const followUser = async (_: any,args: {userId: number},context: {user: user}) => {
 const {id} = context.user;
 const {userId} = args;
 
 const pool = await sql.getConnection();
 
 try {
  await pool.beginTransaction();
  let query = `SELECT id FROM followings WHERE followerId = ? AND followingId = ?`;
  const [rows] = await sql.execute(query, [id,userId]) as RowDataPacket[];
 
  let isFollowing = rows[0];
 
  if(isFollowing) {
   let query = `DELETE FROM followings WHERE followerId = ? AND followingId = ?`;

   await sql.execute(query, [id,userId]);
   await sql.execute(`UPDATE users SET followers = followers - 1 WHERE id = ?`,[userId]);
   await sql.execute(`UPDATE users SET followings = followings - 1 WHERE id = ?`,[id]);

   await pool.commit();
   return {message: "Unfollowed"};
  } else {
   await sql.execute(`INSERT INTO followings (followerId, followingId) VALUES (?,?)`, [id,userId]);
   await sql.execute(`UPDATE users SET followers = followers + 1 WHERE id = ?`, [userId]);
   await sql.execute(`UPDATE users SET followings = followings + 1 WHERE id = ?`,[id]);

   await pool.commit();
   return {message: "Followed"};
  };
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 } finally {
  pool.release();
 };
};

export default followUser;