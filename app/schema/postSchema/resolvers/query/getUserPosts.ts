import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

const getUserPosts = async (_: null,args: {id: number}) => {
 const {id} = args;
   
 try {
  const [rows] = await sql.query(`SELECT * FROM posts WHERE id = ?`,[id]);
  return rows;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getUserPosts;