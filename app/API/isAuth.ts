import type {Request,Response,NextFunction as NF} from "express";
import jwt from "jsonwebtoken";

const isAuth = (req: Request,res: Response,next: NF) => {
 const wT = req.cookies.aT;
 const token = process.env.JWT_TOKEN as string;

 if(wT) {
  jwt.verify(wT,token,(err: any,payload: any) => {
   if(err) return res.status(401).clearCookie("aT").json({message: "Unauthorized"});
   else {
    res.locals.user = payload;
    next();
   }
  });

 } else {
  return res.status(401).json({message: "Unauthorized"});
 };
};

export default isAuth;