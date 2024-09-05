import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

const getPostComments = async (_: any,{postId}: {postId: number}) => {
 try {
  const [rows] = await sql.query(
   `SELECT p.id, postId, comment, userInteracted, username 
    FROM postinteract as p 
    INNER JOIN users ON p.userInteracted = users.id 
    WHERE postId = ? AND comment != ''`,
   [postId]
  );
 
  return rows;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getPostComments;