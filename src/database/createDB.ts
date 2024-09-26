import sql from "../config/sql";

const createDB = async () => {
 try {
  await sql.query(`CREATE DATABASE IF NOT EXISTS social`);
 } catch (error) {
  console.log("Db creation error",error);
 };
};

export default createDB;