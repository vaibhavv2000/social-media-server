import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";
import type {RowDataPacket} from "mysql2";

const addPost = async (req: Request,res: Response,next: NextFunction) => {
 const {id} = res.locals.user;
 const {status = "", photo = ""} = req.body;
 const pool = await sql.getConnection();
   
 try {
  await pool.beginTransaction();
   
  await sql.execute(
   `INSERT INTO posts (status, photo, userId) VALUES (?,?,?)`,
   [status,photo,id]
  );
   
  const [rows] = await sql.execute(`SELECT LAST_INSERT_ID() as id`) as any;
  await sql.execute(`UPDATE users SET posts = posts + 1 WHERE id = ?`,[id])
  await pool.commit();

  const postId = (rows as RowDataPacket[])[0].id;
   
  return res.status(201).json({
       id: postId,
       status,
       photo,
       userId: id,
       likes: 0,
       comments: 0,
       bookmarks: 0,
  });
 } catch(error) {
  await pool.rollback();
  next(error);
 } finally {
  pool.release();  
 };
};

export default addPost;