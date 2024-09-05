import {GraphQLError} from "graphql";
import {user} from "../../../../utils/types";
import sql from "../../../../config/sql";
import {RowDataPacket} from "mysql2";

const getUserData = async (_: null, __: null, context: {user: user}) => {
 const {id} = context.user;
 
 try {
  const [rows] = await sql.query(`SELECT * FROM users WHERE id = ?`,[id]) as RowDataPacket[];
  return rows[0] as user;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getUserData;