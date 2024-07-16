import sql from "../config/sql";

const createNotifications = async () => {
  let createTable = `
     CREATE TABLE IF NOT EXISTS notifications (
     id INT NOT NULL auto_increment,
     action_type VARCHAR(50) DEFAULT '',
     toWhom INT NOT NULL,
     byWhom INT NOT NULL,
     postId INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY(toWhom) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY(byWhom) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE,
     index(toWhom)
   )`;

  try {
    const table = await sql.query(createTable);
    console.log("Notifications Table created");
  } catch(error) {
    console.log(error);
  };
};

export {createNotifications};