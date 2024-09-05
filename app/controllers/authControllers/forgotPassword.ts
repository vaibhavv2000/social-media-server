import type {NextFunction, Request, Response} from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import {validateEmail} from "../../utils/emailValidator";
import uuid from "../../utils/uuid";
import transporter from "../../config/email";

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
 const {email} = req.query as {email: string};

 if(!email) return res.status(400).json({message: "Please provide your Email"});
 if(!validateEmail(email)) res.status(400).json({message: "Invalid Email"});
 
 const code = uuid(6);
 
 try {
  await transporter.sendMail({
   from: process.env.EMAIL_USER,
   to: email,
   subject: "Password Recovery",
   html: `
    <h4>${code}</h4>
    <br />
    <p>Password reset code, valid for only 5 minutes</p>
   `,
  });
     
  const token: string = jwt.sign(
   {code, email},
   process.env.JWT_TOKEN as string,
   {expiresIn: "10m"},  
  );
    
  return res.status(200).json({token, code});  
 } catch (error) {
  next(error);  
 }
};

export default forgotPassword;