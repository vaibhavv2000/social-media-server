import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";
import type {user} from "../../../../utils/types";
import {RowDataPacket} from "mysql2";

interface args {
 status: string;
 photo: string;
};

const addPost = async (_: null,args: args,context: {user: user}) => {
 const {id} = context.user;
 
 const {status = "",photo = ""} = args;
 const pool = await sql.getConnection();
 
 try {
  await pool.beginTransaction();
  const query = `INSERT INTO posts (status, photo, userId) VALUES (?,?,?)`;
  await sql.execute(query,[status,photo,id]);

  const [rows] = await sql.query(`SELECT LAST_INSERT_ID() as id`) as RowDataPacket[];
  await pool.commit();
 
  let {id: postId} = rows[0] as {id: number};

  return {
   id: postId,
   status,
   photo,
   userId: id,
   likes: 0,
   comments: 0,
   bookmarks: 0,
  };
 } catch(error: any) {
  await pool.rollback();
  throw new GraphQLError(error.message);
 } finally {
  pool.release();
 }
};

export default addPost;