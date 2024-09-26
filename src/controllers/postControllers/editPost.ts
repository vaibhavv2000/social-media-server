import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";

const editPost = async (req: Request,res: Response,next: NextFunction) => {
 const {postId, status = "", photo = ""} = req.body;

 let query = `UPDATE posts SET status = ? ${photo && ", photo = ?"} WHERE id = ?`;
 let values = [status, postId];
 if(photo) values.splice(1, 0, photo);

 try {
  await sql.execute(query, values);
  return res.status(200).json({message: "Post updated"});
 } catch(error) {
  next(error);
 };
};

export default editPost;