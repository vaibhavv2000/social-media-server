import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";
import type {RowDataPacket} from "mysql2";

const addPost = async (req: Request,res: Response,next: NextFunction) => {
 const {id} = res.locals.user;
 const {status = "", photo = ""} = req.body;
 const pool = await sql.getConnection();
   
 try {
  await pool.beginTransaction();
  const statement = `INSERT INTO posts (status, photo, userId) VALUES (?, ?, ?)`;
  let query = `SELECT id, createdAt FROM posts WHERE id = LAST_INSERT_ID()`;
   
  await sql.execute(statement, [status,photo,id]);
  const [rows] = await sql.execute(query) as RowDataPacket[];
  await sql.execute(`UPDATE users SET posts = posts + 1 WHERE id = ?`,[id])
  await pool.commit();

  const {id: postId, createdAt} = rows[0];

  return res.status(201).json({id: postId, createdAt});
 } catch(error) {
  await pool.rollback();
  next(error);
 } finally {
  pool.release();  
 };
};

export default addPost;