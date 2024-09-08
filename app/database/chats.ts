import sql from "../config/sql";

let createTable = `
 CREATE TABLE IF NOT EXISTS chats (
  id INT NOT NULL AUTO_INCREMENT,
  text VARCHAR(5000),
  sender INT NOT NULL,
  receiver INT NOT NULL,
  sentAt TIMESTAMP DEFAULT current_timestamp(),
  PRIMARY KEY(id),
  FOREIGN KEY(sender) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(receiver) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)`;

const createChatTable = async () => {
 try {
  await sql.query(createTable);
  console.log("Chat Table created");
 } catch(error) {
  console.log("POST_INTERACT_TABLE_ERROR",error);
 };
};

export default createChatTable;