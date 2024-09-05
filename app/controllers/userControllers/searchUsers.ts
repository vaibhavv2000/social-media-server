import type {Request, Response, NextFunction} from "express";
import sql from "../../config/sql";
import type {RowDataPacket} from "mysql2";
import type {user} from "../../utils/types";

const searchUsers = async (req: Request,res: Response,next: NextFunction) => {
 const {query} = req.query;
 const {username} = res.locals.user;

 if(!query || !username) return res.status(400).json({message: "All fields are required"});

 let statement = `SELECT name, username, id FROM users 
  WHERE name LIKE ? OR username LIKE ? LIMIT 10`;

 try {
  const [rows] = await sql.query(statement, [`%${query}%`,`%${query}%`]);
  const getUsers = ((rows as RowDataPacket[])[0] as user[]);
  const users = getUsers.filter(item => item.username !== username);
  
  return res.status(200).send(users);
 } catch(error) {
  next(error);
 };
};

export default searchUsers;