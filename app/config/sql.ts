import {createPool} from "mysql2/promise";
import "dotenv/config";

const config = {
    host: "localhost",
    user: "root",
    database: "social",
    password: "vaibhavk15"
};

const prod = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: 10758,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    },
}

const sql = createPool(config);

sql.on("connection",() => {
    console.log("DB_CONNECTED");
});

export default sql;