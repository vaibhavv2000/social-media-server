import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";

const explorePosts = async (req: Request,res: Response,next: NextFunction) => {
 const {skip} = req.query;
 const {id} = res.locals.user;

 try {
  const photos = await sql.execute(
   `SELECT photo, id as postId FROM posts
    WHERE photo != '' OR userId != ? ORDER BY RAND() 
    LIMIT 50 OFFSET ${skip}`,
   [id]
  );

  return res.status(200).send(photos[0]);
 } catch(error) {
  next(error);
 };
};

export default explorePosts;