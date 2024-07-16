import {createPool} from "mysql2/promise";
import "dotenv/config";

const sql = createPool({
 host: "localhost" || process.env.DB_HOST,
 user: "root" || process.env.DB_USER,
 password: "vaibhavk15" || process.env.DB_PWD,
 database: "social",
});

export default sql;