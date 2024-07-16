import sql from "../config/sql";

const q1 = `
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
  PRIMARY KEY (id)
)`;

const q2 = `CREATE UNIQUE INDEX uix_puser ON users (username, email)`;

const pro1 = `
  DELIMITER $$
  CREATE PROCEDURE get_user(IN user_name VARCHAR(30))
  BEGIN
    select name,id,username FROM users WHERE username = user_name;
  END $$
  DELIMITER ;
`;

const pro2 = `
  DELIMITER $$
  CREATE PROCEDURE validate_user(IN user VARCHAR(255))
  BEGIN
    select name,id,username FROM users WHERE username = user OR email = user;
  END $$
  DELIMITER ;
`;

const q3 = `show procedure status`;

const pro3 = `
  DELIMITER $$
  CREATE PROCEDURE new_user(IN u_name VARCHAR(255), IN u_username VARCHAR(30), IN u_email VARCHAR  (255),IN u_password VARCHAR(255))
  BEGIN
     INSERT INTO users (name,username,email,password) VALUES
     (u_name, u_username, u_email, u_password);
    
     SELECT name, username, id from users WHERE username = u_username;
  END $$
  DELIMITER ;
`;

const createUser = async () => {
  try {
    const p1 = await sql.query(q1);
    const p2 = await sql.query(q2);
    // const p3 = await sql.query(q3);
    // const p6 = await sql.query(pro1);
    // const p7 = await sql.query(pro2);
    // const p8 = await sql.query(pro3);
    console.log("User Table created");
  } catch(error) {
    console.log(error);
  };
};

export {createUser};