import {GraphQLError} from "graphql";
import sql from "../../../../config/sql";

interface args {
 postId: number;
 status: string;
 photo: string;
};

const editPost = async (_: null,args: args,) => {
 const {postId, status = "", photo = ""} = args;

 let query = `UPDATE posts SET ${status && "status = ?"} ${photo && ", photo = ?"} WHERE id = ?`;
 let values = [status, postId];
 if(photo) values.splice(1, 0, photo);

 try {
  await sql.execute(query, values);
  return {message: "Post updated"};
 } catch(error: any) {
  throw new GraphQLError(error.message);
 }
};

export default editPost;