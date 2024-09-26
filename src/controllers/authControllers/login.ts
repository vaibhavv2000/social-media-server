import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import {cookieOptions} from "../../utils/cookieOptions";
import type {user} from "../../utils/types";
import type {RowDataPacket} from "mysql2";

const login = async (req: Request,res: Response,next: NextFunction) => {
 const {user, password} = req.body as user & {user: string};
 if(!user || !password) return res.status(400).json({message: "All fields are necessary"});

 try {
  let query = `SELECT * FROM users WHERE username = ? OR email = ?`;  
  const [rows] = await sql.execute(query, [user,user])as RowDataPacket[];

  const currentUser = rows[0] as user;
  if(!currentUser) {
   return res.status(404).json({message: "No user found with the given credentials"});  
  };

  let pwd: boolean = await bcrypt.compare(password, currentUser.password);
  if(!pwd) return res.status(400).json({message: "Username/Email or password might be wrong"});

  const getUser = (user: user) => {
   const {password, ...other} = user;
   return other;
  };

  const loginUser = getUser(currentUser);
  const {username, email, id} = loginUser;

  const token: string = jwt.sign(
   {username, email, id},
   process.env.JWT_TOKEN as string,
   {expiresIn: "30d"}
  );

 return res
  .status(200)
  .cookie("socialuser", token, cookieOptions)
  .json(loginUser);
 } catch(error) {
  next(error);
 };
};

export default login;