import type {NextFunction, Request, Response} from "express";
import "dotenv/config";
import sql from "../../config/sql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {cookieOptions} from "../../utils/cookieOptions";
import type {user} from "../../utils/types";
import type {RowDataPacket} from "mysql2";

const registerConfirm = (req: Request, res: Response, next: NextFunction) => {
 const {token, code, password} = req.body;

 if(!token || !code || !password) {
  return res.status(400).json({message: "All fields are necessary"});
 };

 if(password.length < 8) return res.status(400).json({message: "All fields are necessary"});
 if(password.includes(" ")) return res.status(400).json({message: "Password must not include ' ' character"});
 
 jwt.verify(token, process.env.JWT_TOKEN as string, async (err: any, payload: any) => {
  if(err) return res.status(401).json({message: "Unauthorized"});
  const {name, username, email, code} = payload;

  if(code !== req.body.code) return res.status(400).json({message: "Wrong code provided"});

  try {
   const salt: string = await bcrypt.genSalt(10);
   const hash: string = await bcrypt.hash(password,salt);

   let query = `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`;
   await sql.execute(query, [name, email, username, hash]);

   const [data] = await sql.query(`SELECT LAST_INSERT_ID() as id`);
   const {id} = (data as RowDataPacket[])[0] as user;

   const userToken: string = jwt.sign(
    {username, email, id},
    process.env.JWT_TOKEN as string,
    {expiresIn: "30d",}
   );

   res
   .status(201)
   .cookie("socialuser", userToken, cookieOptions)
   .json({name, username, email, id});
  } catch (error) {
   next(error)
  };
 });
};

export default registerConfirm;