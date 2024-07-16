import {createPool} from "mysql2/promise";
import "dotenv/config";

const sql = createPool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PWD,
 database: process.env.DB_NAME,
});

sql.on("connection",(err) => {
 if(err) return console.log("ERROR======>",err);
 console.log("DB_CONNECTED");
});

export default sql;