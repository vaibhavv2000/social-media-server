import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";
import {RowDataPacket} from "mysql2";

const bookmarkPost = async (req: Request, res: Response, next: NextFunction) => {
 const {id} = res.locals.user;
 const {postId} = req.query;
 const pool = await sql.getConnection();
 try {
  const query = `INSERT INTO bookmarks (postId, bookmarkedBy) values (?, ?)`;
  await pool.beginTransaction();
  await sql.execute(query, [Number(postId), id]) as RowDataPacket[];
  await sql.execute("UPDATE posts SET bookmarks = bookmarks + 1 WHERE id = ?", [postId]);
  await pool.commit();
  return res.status(201).json({success: true});
 } catch (error) {
  await pool.rollback();
  next(error);
 } finally {
  pool.release();
 };
};

export default bookmarkPost;