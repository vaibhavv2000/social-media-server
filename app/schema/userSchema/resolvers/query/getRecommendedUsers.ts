import {RowDataPacket} from "mysql2";
import {user} from "../../../../utils/types";
import sql from "../../../../config/sql";
import {GraphQLError} from "graphql";

const getRecommendedUsers = async ( _: null,{query}: {query: string}, context: {user: user}) => {
 const {id} = context.user;
 
 try {
  if(query) {
   const [rows] = await sql.execute(
    `SELECT name, username, id, profile FROM users 
     WHERE name LIKE ? OR username = ? AND id != ? LIMIT 10`,
    [`%${query}%`,`%${query}%`,id]
   ) as RowDataPacket[];
 
   return rows;
  } else {
   const [rows] = await sql.execute(
    `SELECT name, username, id, profile FROM users WHERE id != ? ORDER BY RAND() LIMIT 4`,
    [id]
   ) as RowDataPacket[];
 
   return [rows];
  }
 } catch(error: any) {
  throw new GraphQLError(error.message,{
   extensions: {
    code: "Server error",
    http: { status: 500 }
   },
  });
 };
};

export default getRecommendedUsers;