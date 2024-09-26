import {Router} from "express";
import searchUsers from "../controllers/userControllers/searchUsers";
import updateUser from "../controllers/userControllers/updateUser";
import deleteUser from "../controllers/authControllers/deleteUser";
import isAuth from "../middlewares/isAuth";

const router = Router();

router.get("/searchusers", searchUsers);

router.put("/updateuser", updateUser);

router.delete("/deleteuser", isAuth, deleteUser);

export {router as userRouter};