import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {user} from "../../../../utils/types";
import {RowDataPacket} from "mysql2";

const updateUser = async (_: any, args: user, context: {user: user}) => {
 const {id} = context.user;
 let {name, username, email, bio, profile = "", cover = ""} = args;
 
 try {
  await sql.execute(
   `UPDATE users SET name = ?, username = ?, email = ?, bio = ?,   
    profile = ?, cover = ? WHERE id = ?`,
   [name, username, email, bio, profile, cover, id]
  );
 
  let query = `SELECT name, email, username, profile, cover, bio FROM users WHERE id = ?`;
 
  const [rows] = await sql.query(query, [id]) as RowDataPacket[];
  return rows[0];
 } catch(error: any) {
  throw new GraphQLError(error.message);
 }
};

export default updateUser;