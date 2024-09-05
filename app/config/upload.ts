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
 try {
  await rm(`${imgPath}/${imgName}`);
 } catch(error) {
  console.log("REMOVED_IMAGE",error);
 };
};

export {upload, removeImage};