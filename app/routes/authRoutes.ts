import {Router} from "express";
import isAuth from "../middlewares/isAuth";
import register from "../controllers/authControllers/register";
import login from "../controllers/authControllers/login";
import checkAuth from "../controllers/authControllers/checkAuth";
import logout from "../controllers/authControllers/logout";
import registerConfirm from "../controllers/authControllers/registerConfirm";
import forgotPassword from "../controllers/authControllers/forgotPassword";
import resetPassword from "../controllers/authControllers/resetpassword";

const router = Router();

router.post("/register", register);

router.post("/register-confirm", registerConfirm);

router.post("/login", login);

router.get("/checkauth", isAuth, checkAuth);

router.get("/forgotpassword", forgotPassword);

router.put("/resetpassword", resetPassword);

router.delete("/logout", logout);

export {router as authRouter};