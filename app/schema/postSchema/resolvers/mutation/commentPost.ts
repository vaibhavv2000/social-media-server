import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {user} from "../../../../utils/types";
import type {RowDataPacket} from "mysql2";

interface args {postId: number; comment: string};

const commentPost = async (_: null,args: args,context: {user: user}) => {
 const {postId, comment} = args;
 const {id} = context.user;
 const pool = await sql.getConnection();
 const query = `INSERT INTO postInteract (postId, comment, userInteracted) VALUES (?, ?, ?)`;
 let statement = `SELECT * FROM postInteract WHERE id = LAST_INSERT_ID()`;
 
 try {
  await pool.beginTransaction();
  await sql.execute(query, [postId,comment,id]);
  const [rows] = await sql.query(statement) as RowDataPacket[];
 
  await sql.execute(`UPDATE posts SET comments = comments + 1 WHERE id = ?`, [postId]);
 
  await pool.commit();
  return rows[0];
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 };
};

export default commentPost;