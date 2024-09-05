const postTypeDefs = `#graphql
 
  type post {
   id: ID
   status: String
   photo: String
   userId: ID
   likes: Int
   comments: Int
   bookmarks: Int
   created_at: String
   name: String
   username: String
   profile: String
   isLiked: Boolean
  }

  type photo {
   photo: String
   postId: Int
  }

  type message {
   message: String
  }

  type comment {
   id: ID
   postId: ID
   comment: String
   userInteracted: ID
   username: String
  }

  type Query {
   getTimelinePosts: [post]
   getRandomPhotos(explore: Boolean,skip: Int, username: String): [photo]
   getUserPosts(id: ID!): [post]
   getSinglePost(postId: ID!): post
   getPostComments(postId: ID!): [comment]
  }

  type Mutation {
   addPost(status: String,photo: String): post
   editPost(postId: ID!,status: String,photo: String): message
   deletePost(postId: ID!, photo: String): message
   likePost(postId: ID!): message
   commentPost(postId: ID!, comment: String!): message
   deleteComment(postId: ID!, comment: String!): message
  }
`;

export default postTypeDefs;