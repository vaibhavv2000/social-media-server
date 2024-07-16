import {Router} from "express";
import {AuthRouter} from "./Auth";
import {userRouter} from "./user";
import isAuth from "./isAuth";
import {uploadRouter} from "../config/upload";
import {db_init} from "../db/dbInit";

const router = Router();

router.use("/auth",AuthRouter);

router.use("/user",isAuth,userRouter);

router.use("/upload",isAuth,uploadRouter);

router.get("/initdb",async (req,res) => {
 const init = req.query.init ? true : false;

 try {
  const result = await db_init();
  if(result) return res.status(201).json({message: "Database initialized"});
  else return res.status(500).json({message: "Server error"});
 } catch (error) {
  return res.status(500).json(error); 
 };
});

export {router as API};
