import {rm} from "fs/promises";
import path from "path";
import multer from "multer";

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

const removeImage = async (imgName: string) => {
 await rm(`${imgPath}/${imgName}`);
};

export {upload, removeImage};