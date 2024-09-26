import type {NextFunction, Request, Response} from "express";
import sql from "../../config/sql";

const updateUser = async (req: Request,res: Response,next: NextFunction) => {
 const {id} = res.locals.user;
 let {name, username, email, bio, profile = "", cover = ""} = req.body;

 try {
  await sql.execute(
   `UPDATE users SET name = ?, username = ?, email = ?, bio = ?,   
    profile = ?, cover = ? WHERE id = ?`,
    [name,username,email,bio,profile,cover,id]
  );

  return res.status(200).send({success: true});
 } catch(error) {
  next(error);
 };
};

export default updateUser;