import {Router} from "express";
import explorePosts from "../controllers/userControllers/explorePosts";
import addPost from "../controllers/postControllers/addPost";
import editPost from "../controllers/postControllers/editPost";
import bookmarkPost from "../controllers/postControllers/bookmarkPost";
import deleteBookmark from "../controllers/postControllers/deleteBookmark";

const router = Router();

router.get("/exploreposts", explorePosts);

router.post("/addpost", addPost);

router.put("/editpost", editPost);

router.post("/bookmark", bookmarkPost);

router.delete("/bookmark", deleteBookmark);

export {router as postRouter};