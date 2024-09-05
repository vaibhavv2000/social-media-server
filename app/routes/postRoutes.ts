import {Router} from "express";
import explorePosts from "../controllers/userControllers/explorePosts";
import addPost from "../controllers/postControllers/addPost";
import editPost from "../controllers/postControllers/editPost";

const router = Router();

router.get("/exploreposts", explorePosts);

router.post("/addpost", addPost);

router.put("/editpost", editPost);

export {router as postRouter};