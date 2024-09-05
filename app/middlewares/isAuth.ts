import type {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const token = process.env.JWT_TOKEN as string;

const isAuth = (req: Request,res: Response,next: NextFunction) => {
 const cookie = req.cookies.socialuser;
 if(!cookie) return res.status(401).json({message: "Unauthorized"});

 jwt.verify(cookie, token, (err: any, payload: any) => {
  if(err) return res.status(401).clearCookie("socialuser").json({message: "Unauthorized"});
  res.locals.user = payload;
  next();
 });
};

export default isAuth;