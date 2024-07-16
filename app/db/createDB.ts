import sql from "../config/sql";

export const createDB = async () => {
  try {
    await sql.query(`CREATE DATABASE IF NOT EXISTS social`);
    console.log("DB created");
  } catch (error) {
    console.log("Db creation error",error);
  };
}; 