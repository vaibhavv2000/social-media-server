import {GraphQLError} from "graphql";
import type {user} from "../../../utils/types";
import sql from "../../../config/sql";

const getNotifications = async (_: null, __: null, context: {user: user}) => {
 const {id} = context.user;

 try {
  const [rows] = await sql.query(`SELECT * FROM notifications WHERE toWhom = ?`, [id]);
  return rows;
 } catch(error: any) {
  throw new GraphQLError(error.message);
 };
};

export default getNotifications;