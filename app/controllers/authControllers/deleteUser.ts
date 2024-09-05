import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";

const deleteUser = async (_: Request,res: Response,next: NextFunction) => {
 const {id} = res.locals.user;

 try {
  await sql.execute(`DELETE FROM users WHERE id = ?`,[id]);
  return res.status(200).clearCookie("socialuser").json({success: true});
 } catch(error) {
  next(error);
 };
};

export default deleteUser;