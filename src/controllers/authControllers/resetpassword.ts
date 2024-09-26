import type {NextFunction, Request, Response} from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import sql from "../../config/sql";
import bcrypt from "bcrypt";

const resetPassword = (req: Request, res: Response, next: NextFunction) => {
 const {code, password, token} = req.body;

 if(!code || !password || !token) {
  return res.status(400).json({message: "All fields are required"});
 };

 jwt.verify(token, process.env.JWT_TOKEN as string,async (err: any, payload: any) => {
  if(err) return res.status(401).json({message: "Unauthorized"});

  const {email} = payload;
  if(code !== payload.code) return res.status(400).json({message: "Wrong code provided"});

  try {
   const salt: string = await bcrypt.genSalt(10);
   const hash: string = await bcrypt.hash(password,salt);

   await sql.execute('UPDATE users SET password = ? WHERE email = ?', [hash, email])
   return res.status(200).json({success: true}); 
  } catch (error) {
   next(error); 
  };
 });
};

export default resetPassword;