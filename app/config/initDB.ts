import type {NextFunction, Request, Response} from "express";
import createUser from "../database/user";
import createPost from "../database/posts";
import createPostInteract from "../database/postInteract";
import createNotifications from "../database/notifications";
import createFollowing from "../database/following";
import createBookmark from "../database/bookmarks";

const initDB = async (_: Request,res: Response, next: NextFunction) => {
 try {
  await createUser();
  await createPost();
  await createPostInteract();
  await createNotifications();
  await createFollowing();
  await createBookmark();
  return res.status(201).json({success: true});
 } catch (error) {
  next(error);
 };
};

export default initDB;