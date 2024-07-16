import sql from "../config/sql";

const createFollowing = async () => {
 let createTable = `
  CREATE TABLE IF NOT EXISTS followings (
   id INT NOT NULL auto_increment,
   followerId INT NOT NULL,
   followingId INT NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY(followerId) REFERENCES users(id) ON DELETE CASCADE,
   FOREIGN KEY(followingId) REFERENCES users(id) ON DELETE CASCADE
 )`;

 try {
  const table = await sql.query(createTable);
  console.log("Followings Table created");
 } catch(error) {
  console.log("FOLLOWING_TABLE_ERROR",error);
 };
};

export {createFollowing};