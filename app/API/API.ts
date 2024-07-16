import {Router} from "express";
import {AuthRouter} from "./Auth";
import {userRouter} from "./user";
import isAuth from "./isAuth";
import {uploadRouter} from "../config/upload";
import {createUser} from "../db/user";
import {createPost} from "../db/posts";
import {createPostInteract} from "../db/postInteract";
import {createNotifications} from "../db/notifications";
import {createFollowing} from "../db/following";

const router = Router();

router.use("/auth",AuthRouter);

router.use("/user",isAuth,userRouter);

router.use("/upload",isAuth,uploadRouter);

router.get("/init-db",async (req,res) => {
 const init = req.query.init ? true : false;

 try {
  await createUser();
//   await createPost();
//   await createPostInteract();
//   await createNotifications();
//   await createFollowing();
  return res.status(201).json({message: "Database initialized"});
 } catch (error) {
  return res.status(500).json(error); 
 };
});

export {router as API};
