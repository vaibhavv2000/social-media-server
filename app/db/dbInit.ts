import {createDB} from "./createDB";
import {createFollowing} from "./following";
import {createNotifications} from "./notifications";
import {createPostInteract} from "./postInteract";
import {createPost} from "./posts";
import {createUser} from "./user";

const db_init = async () => {
 try {
  await createDB();
  await createUser();
  await createPost();
  await createPostInteract();
  await createNotifications();
  await createFollowing();
  return true;
 } catch(error) {
  console.log("DB_INITIALIZE_ERROR",error);
  return false;
 };
};

export {db_init};