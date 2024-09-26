import type {RowDataPacket} from "mysql2";
import sql from "../../../../config/sql";
import type {followings, user} from "../../../../utils/types";
import {GraphQLError} from "graphql";

const getUser = async (_: any,{username}: {username: string},context: {user: user}) => {
 const {id} = context.user;
 
 try {
  const [rows] = await sql.query(
   `SELECT id, name, bio, email, username, posts, followers, followings, cover, profile 
    FROM users WHERE username = ? LIMIT 1`,
   [username]
  ) as RowDataPacket[];
 
  let user = rows[0] as user & {isFollowing: boolean};
 
  if(!user) {
   throw new GraphQLError("No user found",{
    extensions: {
     http: {status: 404},
     status: "NOT_FOUND",
    },
   });
  };

  let query = `SELECT id FROM followings WHERE followerId = ? AND followingId = ?`;
  const [data] = await sql.execute(query, [id,user.id]) as RowDataPacket[];

  let isFollowing = data[0] as followings;

  if(isFollowing) user.isFollowing = true;
  else user.isFollowing = false;
 
  return user;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getUser;