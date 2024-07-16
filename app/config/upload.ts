import {Router,Request,Response,NextFunction,} from "express";
import {rm} from "fs/promises";
import path from "path";
import multer from "multer";

const router: Router = Router();

let imgPath = path.join(process.cwd(),"/app/images");

const storage = multer.diskStorage({
 destination: (req,file,cb) => {
  cb(null,imgPath);
 },
 filename: (req,file,cb) => {
  cb(null,req.body.name);
 },
});

const upload = multer({storage});

router.post(
 "/upload",
 upload.single("file"),
 (_: Request,res: Response,next: NextFunction) => {
   return res.status(201).json({message: "uploaded"});
 }
);

const removeImage = async (imgName: string) => {
 try {  
  await rm(`${imgPath}/${imgName}`);
 } catch(error) {
  console.log(error);
 };
};

export {router as uploadRouter,removeImage};