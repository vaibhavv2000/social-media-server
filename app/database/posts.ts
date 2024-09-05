import sql from "../config/sql";

const createPost = async () => {
 let createTable = `
  CREATE TABLE IF NOT EXISTS posts (
   id INT NOT NULL AUTO_INCREMENT,
   userId INT NOT NULL,
   status VARCHAR(500),
   photo VARCHAR(500),
   likes INT DEFAULT 0, 
   comments INT DEFAULT 0, 
   bookmarks INT DEFAULT 0,
   created_at TIMESTAMP DEFAULT current_timestamp(),
   PRIMARY KEY(id),
   FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
   INDEX(userId)
 )`;

 try {
  await sql.query(createTable);
  console.log("Posts Table created");
 } catch (error) {
  console.log("POST_TABLE_ERROR",error);
 };
};

export default createPost;