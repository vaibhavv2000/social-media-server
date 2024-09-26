import {Request, Response, Router} from "express";
import {upload} from "../config/upload";

const router = Router();

router.post("/", upload.single("file"), (_: Request,res: Response) => {
 return res.status(201).json({message: "uploaded"});
});

export {router as uploadRouter};