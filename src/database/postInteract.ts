import sql from "../config/sql";

let createTable = `
 CREATE TABLE IF NOT EXISTS postInteract (
  id INT NOT NULL AUTO_INCREMENT,
  postId INT NOT NULL,
  liked BOOLEAN,
  comment VARCHAR(255) DEFAULT '',
  bookmarked BOOLEAN,
  userInteracted INT NOT NULL,
  createdAt TIMESTAMP DEFAULT current_timestamp(),
  PRIMARY KEY(id),
  FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(userInteracted) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
 )`;

const createPostInteract = async () => {
 try {
  await sql.query(createTable);
  console.log("Post Interact Table created");
 } catch(error) {
  console.log("POST_INTERACT_TABLE_ERROR",error);
 };
};

export default createPostInteract;