import jwt from "jsonwebtoken";
import {Request,Router,Response,NextFunction as NF} from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import isAuth from "./isAuth";
import sql from "../config/sql";

const router: Router = Router();

router.post("/register",async (req: Request,res: Response,next: NF) => {
 const {name,email,username,password,mobile} = req.body;

 if(!name || !email || !username || !password) {
  return res.status(400).json({message: "All fields are required"});
 };

 try {
  const user = await sql.execute(
   `SELECT username, email FROM users WHERE username = ? OR email = ?`,
   [username,email]
  ) as any;

  let existingUser = user[0][0];

  if(existingUser) {
   if(email === existingUser.email) {
    return res.status(400).json({message: "Email already exists"});
   }

   if(username === existingUser.username) {
    return res.status(400).json({message: "Username already taken"});
   }
  };

  const salt: string = await bcrypt.genSalt(10);
  const hash: string = await bcrypt.hash(password,salt);

  const addUser = await sql.execute(
   `INSERT INTO users (name, email, username, password) VALUES (?,?,?,?)`,
   [name,email,username,hash]
  );

  const newUser = await sql.execute(
   `SELECT id, bio, username, name, email, password, profile, cover,
    followers, followings, posts FROM users 
    WHERE username = ? AND email = ?`,
   [username,email]
  ) as any;

  const aT: string = jwt.sign(
   {username,email,id: newUser[0][0].id},
   process.env.JWT_TOKEN as string,
   {expiresIn: "30d",}
  );

  if(mobile) return res.status(201).json({user: newUser[0][0]});

  return res.status(201).cookie("aT",aT,{ maxAge: 1000 * 60 * 60 * 24 * 30,}).json({user: newUser[0][0]});

 } catch(error) {
  next(error);
 }
});

router.post("/login",async (req: Request,res: Response,next: NF) => {
 const {user,password,mobile} = req.body;

 if(!user || !password)
  return res.status(400).json({message: "All fields are necessary"});

 try {
  const get_user = await sql.execute(
   `SELECT id, bio, username, name, email, password, profile, cover,
    followers, followings, posts FROM users 
    WHERE username = ? OR email = ?`,
   [user,user]
  ) as any;

  let c_user = get_user[0][0];

  if(!c_user) return res.status(404).json({error: "No user found"});

  let pwd: boolean = await bcrypt.compare(password,c_user.password);

  if(!pwd) return res.status(400).json({message: "Wrong PWD"});

  const n_user = {
   username: c_user.username,
   email: c_user.email,
   id: c_user.id,
   profile: c_user.profile,
   cover: c_user.cover,
   name: c_user.name,
   bio: c_user.bio,
   followers: c_user.followers,
   followings: c_user.followings,
   posts: c_user.posts,
  };

  const aT: string = jwt.sign(
   { 
    username: n_user.username,
    email: n_user.email,
    id: n_user.id,
   },
   process.env.JWT_TOKEN as string,
   {expiresIn: "30d"}
  );

  if(mobile) return res.status(200).json({user: n_user,aT});

  return res
      .status(200)
      .cookie("aT",aT,{maxAge: 1000 * 60 * 60 * 24 * 30})
      .json({user: n_user});
 } catch(error) {
  next(error);
 };
});

router.delete("/logout",isAuth,async (_: Request,res: Response,next: NF) => {
 try {
  res.status(200).clearCookie("aT").json({message: "Logged out"});
 } catch(error) {
  next(error);
 }
});

router.delete("/deleteuser",isAuth,async (_: Request,res: Response,next: NF) => {
 const {user} = res.locals;

 try {
  await sql.execute(`DELETE FROM users WHERE id = ?`,[user.id]);

  res.status(200).clearCookie("aT").json({message: "Account deleted"});
 } catch(error) {
  next(error);
 };
});

export {router as AuthRouter};
