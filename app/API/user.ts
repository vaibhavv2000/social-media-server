import {Request,Response,Router,NextFunction as NF} from "express";
import sql from "../config/sql";

const router: Router = Router();

router.get("/searchusers",async (req: Request,res: Response,next: NF) => {
 const {query} = req.query;
 const {username} = res.locals.user;

 try {
  const users: any = await sql.query(
   `SELECT name, username, id FROM users 
    WHERE name LIKE ? OR username LIKE ? LIMIT 10`,
   [`%${query}%`,`%${query}%`]
  );

  const getusers = users[0].filter((u: any) => u.username !== username);

  return res.status(200).send(getusers);
 } catch(error) {
  next(error);
 };
});

router.get("/exploreposts",async (req: Request,res: Response,next: NF) => {
 const {skip} = req.query;
 const {username,id} = res.locals.user;

 try {
  const photos = await sql.execute(
   `SELECT photo, id as postId FROM posts
    WHERE photo != '' OR userId != ? ORDER BY RAND() 
    LIMIT 50 OFFSET ${skip}`,
   [id]
  );

  return res.status(200).send(photos[0]);
 } catch(error) {
  next(error);
 };
});

router.put("/updateuser",async (req: Request,res: Response,next: NF) => {
 const {id} = res.locals.user;
 let {name,username,email,bio,profile = "",cover = ""} = req.body;

 try {
  await sql.execute(
   `UPDATE users SET name = ?, username = ?, email = ?, bio = ?,   
    profile = ?, cover = ? WHERE id = ?`,
   [name,username,email,bio,profile,cover,id]
  );

  return res.status(200).send({message: "Update userdata"});
 } catch(error) {
  next(error);
 };
});

router.post("/addpost",async (req: Request,res: Response,next: NF) => {
 const {status = "",photo = "",id} = req.body;

 const pool = await sql.getConnection();

 try {
  await pool.beginTransaction();

  await sql.execute(
   `INSERT INTO posts (status, photo, userId) VALUES (?,?,?)`,
   [status,photo,id]
  );

  const postId = await sql.execute(`SELECT LAST_INSERT_ID() as id`) as any;

  await sql.execute(`UPDATE users SET posts = posts + 1 WHERE id = ?`,[id])

  await pool.commit();

  let p_id = postId[0][0].id;

  return res.status(201).json({
   post: {
    id: p_id,
    status,
    photo,
    userId: id,
    likes: 0,
    comments: 0,
    bookmarks: 0,
   },
  });
 } catch(error) {
  await pool.rollback();
  next(error);
 };
});

router.put("/editpost",async (req: Request,res: Response,next: NF) => {
 const {id} = res.locals.user;

 const {postId,status = "",photo = ""} = req.body;

 try {
  if(photo) {
   await sql.execute(
    `UPDATE posts SET status = ?, photo = ? WHERE id = ?`,
    [status,photo,postId]
   );

   return res.status(200).json({message: "Post updated"});
  } else {
   await sql.execute(
    `UPDATE posts SET status = ? WHERE id = ?`,
    [status,postId]
   );

   return res.status(200).json({message: "Post updated"});
  };
 } catch(error) {
  next(error);
 };
});

export {router as userRouter};