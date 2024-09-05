import addPost from "./resolvers/mutation/addPost";
import commentPost from "./resolvers/mutation/commentPost";
import deleteComment from "./resolvers/mutation/deleteComment";
import deletePost from "./resolvers/mutation/deletePost";
import editPost from "./resolvers/mutation/editPost";
import likePost from "./resolvers/mutation/likePost";
import getRandomPhotos from "./resolvers/query/getRandomPhotos";
import getTimelinePosts from "./resolvers/query/getTimelinePosts";
import getUserPosts from "./resolvers/query/getUserPosts";

const postResolver = {
 Query: {
  getTimelinePosts,
  getRandomPhotos,
  getUserPosts,  
 },
 Mutation: {
  addPost,
  editPost,
  likePost,
  commentPost,
  deleteComment,
  deletePost,
 },
};

export default postResolver;