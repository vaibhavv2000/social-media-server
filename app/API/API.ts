import {Router} from "express";
import {AuthRouter} from "./Auth";
import {userRouter} from "./user";
import isAuth from "./isAuth";
import {uploadRouter} from "../config/upload";

const router = Router();

router.use("/auth",AuthRouter);

router.use("/user",isAuth,userRouter);

router.use("/upload",isAuth,uploadRouter);

export {router as API};
