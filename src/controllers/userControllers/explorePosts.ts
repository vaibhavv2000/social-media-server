import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import {RowDataPacket} from "mysql2";

const explorePosts = async (req: Request,res: Response,next: NextFunction) => {
 const {skip} = req.query;
 const {id} = res.locals.user;

 try {
  const [photos] = await sql.execute(
   `SELECT photo, likes, comments, id as postId FROM posts
    WHERE photo != '' ORDER BY RAND() LIMIT 50 OFFSET ?`,
   [skip]
  ) as RowDataPacket[];

  return res.status(200).send(photos);
 } catch(error) {
  next(error);
 };
};

export default explorePosts;