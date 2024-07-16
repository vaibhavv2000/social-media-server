import sql from "../config/sql";

let createTable = `
   CREATE TABLE IF NOT EXISTS postintercat (
   id INT NOT NULL AUTO_INCREMENT,
   postId INT NOT NULL,
   liked BOOLEAN,
   comments VARCHAR(255) DEFAULT '',
   boomarked BOOLEAN,
   userInteracted INT NOT NULL,
   PRIMARY KEY(id),
   FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE,
   FOREIGN KEY(userInteracted) REFERENCES users(id) ON DELETE CASCADE
)`;

const renamePostInteract = `RENAME TABLE postintercat TO postInteract`;

const showCols = `SHOW COLUMNS FROM postInteract`;

const dropBookmark = `ALTER TABLE postInteract DROP COLUMN boomarked`;

const addBookmark = `ALTER TABLE postInteract ADD COLUMN bookmarked BOOLEAN`;

const renameComment = `ALTER TABLE postinteract RENAME COLUMN comments TO comment`;

const createPostInteract = async () => {
  try {
    const table = await sql.query(createTable);
    const renamePostInt = await sql.query(renamePostInteract);
    const showColumns = await sql.query(showCols);
    const dropColBookmark = await sql.query(dropBookmark);
    const newColBookmark = await sql.query(addBookmark);
    const renameCommentCol = await sql.query(renameComment);
    console.log("Post Interact Table created");
  } catch(error) {
    console.log(error);
  };
};

export {createPostInteract};