import sql from "../config/sql";

const createFollowingTable = async () => {
 let createTable = `
  CREATE TABLE IF NOT EXISTS followings (
   id INT NOT NULL auto_increment,
   followerId INT NOT NULL,
   followingId INT NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY(followerId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY(followingId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
 )`;

 try {
  await sql.query(createTable);
  console.log("Followings Table created");
 } catch(error) {
  console.log("FOLLOWING_TABLE_ERROR",error);
 };
};

export default createFollowingTable;