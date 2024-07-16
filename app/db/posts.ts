import sql from "../config/sql";

const createPost = async () => {
   let createTable = `
    CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL AUTO_INCREMENT,
    status VARCHAR(500),
    photo VARCHAR(500),
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX(userId)
   )`;

  let alterTable = `
    ALTER TABLE posts 
    ADD(likes INT DEFAULT 0, comments INT DEFAULT 0, bookmarks INT DEFAULT 0)  
  `;

  let addTime = `
  ALTER TABLE posts
  ADD COLUMN created_at TIMESTAMP DEFAULT current_timestamp()
  `;

   try {
     const table = await sql.query(createTable);
     const table1 = await sql.query(alterTable);
     const table2 = await sql.query(addTime);
     console.log("Posts Table created");
   } catch (error) {
     console.log(error);
   };
};

export {createPost};