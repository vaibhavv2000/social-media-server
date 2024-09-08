import {RowDataPacket} from "mysql2";
import {user} from "../../../../utils/types";
import sql from "../../../../config/sql";
import {GraphQLError} from "graphql";

const getRecommendedUsers = async ( _: null,{query}: {query: string}, {user}: {user: user}) => {
 const {id} = user;
 let statement = `SELECT id FROM followings WHERE followerId = ? AND followingId = ?`;

 const getUsers = async (rows: user[]) => {
  return await Promise.all(rows.map(async (item: user) => {
   const [rows] = await sql.query(statement, [id, item.id]) as RowDataPacket[];
   let isFollowing = rows[0] ? true: false;
   return {...item, isFollowing};
  }));
 };
 
 try {
  if(query) {
   const [rows] = await sql.execute(
    `SELECT name, username, id, profile FROM users 
     WHERE name LIKE ? OR username = ? AND id != ? LIMIT 10`,
    [`%${query}%`,`%${query}%`,id]
   ) as RowDataPacket[];

   const users = await getUsers(rows as user[]);
   return users;
  } else {
   const [rows] = await sql.execute(
    `SELECT name, username, id, profile FROM users WHERE id != ? ORDER BY RAND() LIMIT 4`,
    [id]
   ) as RowDataPacket[];

   const users = await getUsers(rows as user[]);
   return users;
  };
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