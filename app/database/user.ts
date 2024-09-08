import sql from "../config/sql";

const query = `
 CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  followers INT DEFAULT 0,
  followings INT DEFAULT 0,
  posts INT DEFAULT 0,
  profile VARCHAR(255), 
  cover VARCHAR(255),
  bio VARCHAR(1000),
  createdAt TIMESTAMP DEFAULT current_timestamp(),
  isActive BOOLEAN,
  PRIMARY KEY (id),
  Index(username, email)
)`;

const createUser = async () => {
 try {
  await sql.query(query);
  console.log("User Table created");
 } catch(error: any) {
  console.log("USER_TABLE_ERROR",error);
 };
};

export default createUser;