import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type {user} from "../../utils/types";
import type {RowDataPacket} from "mysql2";
import {validateEmail} from "../../utils/emailValidator";
import uuid from "../../utils/uuid";
import transporter from "../../config/email";

const register = async (req: Request, res: Response, next: NextFunction) => {
 const {name, email, username} = req.body as user;
   
 if(!name.trim() || !email.trim() || !username.trim()) {
  return res.status(400).json({message: "All fields are required"});
 };

 if(!validateEmail(email)) return res.status(400).json({message: "Invalid Email"});
 if(username.length < 3) {
  return res.status(400).json({message: "Username must be atleast 3 characters"});   
 };

 try {
  let query = `SELECT username, email FROM users WHERE username = ? OR email = ?`;  
  const [rows] = await sql.execute(query, [username,email]) as RowDataPacket[];  
  const user = rows[0] as user;

  if(user && email === user["email"]) {
   return res.status(400).json({message: "Email already exists"});
  } else if(user && username === user["username"]) {
   return res.status(400).json({message: "Username already taken"});
  };

  const code = uuid(6);
  await transporter.sendMail({
   from: process.env.EMAIL_USER,
   to: email,
   subject: "Account Creation",
   html: `
    <h2>Code for creation of SocialApp Account</h2>
    <p>${code}</p>
    <br />
    <h3>Warning:</h3>
    <p>This code will expire in 10 minutes</p>
   `,
  });

  const token: string = jwt.sign(
   {code, ...req.body},
   process.env.JWT_TOKEN as string,
   {expiresIn: "10m",}
  );

  return res.status(200).json({token});
 } catch(error) {
  next(error);
 };
};

export default register;