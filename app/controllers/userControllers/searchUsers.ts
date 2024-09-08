import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import type {RowDataPacket} from "mysql2";
import type {user} from "../../utils/types";

const searchUsers = async (req: Request,res: Response,next: NextFunction) => {
 const {query} = req.query;
 const {username, id} = res.locals.user;

 if(!query || !username) return res.status(400).json({message: "All fields are required"});
 let statement = `SELECT id FROM followings WHERE followerId = ? AND followingId = ?`;

 const getUsers = async (rows: user[]) => {
  return await Promise.all(rows.map(async (item: user) => {
   const [rows] = await sql.query(statement, [id, item.id]) as RowDataPacket[];
   let isFollowing = rows[0] ? true: false;
   return {...item, isFollowing};
  }))
 };

 try {
  let userQuery = `SELECT name, username, id, profile FROM users 
    WHERE name LIKE ? OR username LIKE ? AND username != ? LIMIT 10`;  
  
  const [rows] = await sql.query(userQuery, [`%${query}%`,`%${query}%`, id]) as RowDataPacket[];
  const users = rows.filter((item: user) => item.username !== username);
  const data = await getUsers(users);
  
  return res.status(200).send(data);
 } catch(error) {
  next(error);
 };
};

export default searchUsers;