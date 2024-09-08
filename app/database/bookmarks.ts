import sql from "../config/sql";

const createBookmarkTable = async () => {
 let createTable = `
  CREATE TABLE IF NOT EXISTS bookmarks (
   id INT NOT NULL AUTO_INCREMENT,
   postId INT NOT NULL,
   bookmarkedBy INT NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(bookmarkedBy) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
 )`;

 try {
  await sql.query(createTable);
  console.log("Bookmarks Table created");
 } catch(error) {
  console.log("BOOKMARKS_TABLE_ERROR",error);
 };
};

export default createBookmarkTable;