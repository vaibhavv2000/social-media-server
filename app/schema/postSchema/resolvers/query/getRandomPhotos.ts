import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

interface args {
 explore: boolean; 
 skip: number; 
 username: string
};

const  getRandomPhotos = async (_: null, args: args) => {
 const {explore, skip = 0, username} = args;
 
 try {
  if(username) {
   const [rows] = await sql.query(
    `SELECT photo, id as postId FROM posts 
     WHERE photo != '' AND userId = (SELECT id FROM users WHERE username = ?)
     ORDER BY created_at`,
    [username]
   );
 
   return rows;
  };
 
  if(explore) {
   const [rows] = await sql.execute(
    `SELECT photo, id as postId FROM posts WHERE photo != '' 
     ORDER BY RAND() LIMIT 50 OFFSET ${skip}`
   );
 
   return rows;
  } else {
   let query = `SELECT photo, id as postId FROM posts WHERE photo != '' ORDER BY RAND() LIMIT 6` 
   const [rows] = await sql.query(query);
   return rows;
  };
 } catch(error:any) {
  throw new GraphQLError(error.message);
 };
};

export default getRandomPhotos;