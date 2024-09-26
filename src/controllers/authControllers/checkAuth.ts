import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import type {RowDataPacket} from "mysql2";
import type {user} from "../../utils/types";

const checkAuth = async (_: Request,res: Response,next: NextFunction) => {
 const {id} = res.locals.user;

 try {
  const [rows] = await sql.query(`SELECT * FROM users WHERE id = ?`, id);
  const user = (rows as RowDataPacket)[0] as user;
  const {password, ...data} = user;

  return res.status(200).json(data);
 } catch(error) {
  next(error);
 };
};

export default checkAuth;