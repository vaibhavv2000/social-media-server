import {Router} from "express";
import {authRouter} from "./authRoutes";
import {userRouter} from "./userRoutes";
import {postRouter} from "./postRoutes";
import isAuth from "../middlewares/isAuth";
import {uploadRouter} from "./uploadRoutes";
import initDB from "../config/initDB";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", isAuth, userRouter);

router.use("/post", isAuth, postRouter);

router.use("/upload", isAuth, uploadRouter);

router.post("/initdb", initDB);

export {router as API};