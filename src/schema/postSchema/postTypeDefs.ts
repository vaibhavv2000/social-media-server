const postTypeDefs = `#graphql
 
  type post {
   id: ID
   status: String
   photo: String
   userId: ID
   likes: Int
   comments: Int
   bookmarks: Int
   createdAt: String
   name: String
   username: String
   profile: String
   isLiked: Boolean
   isBookmarked: Boolean
  }

  type photo {
   photo: String
   postId: Int
   likes: Int
   comments: Int
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
   createdAt: String
  }

  type Query {
   getTimelinePosts: [post]
   getRandomPhotos(explore: Boolean,skip: Int, username: String): [photo]
   getUserPosts(username: String!): [post]
   getSinglePost(postId: ID!): post
   getPostComments(postId: ID!): [comment]
   getBookmarks: [post]
  }

  type Mutation {
   addPost(status: String, photo: String): post
   editPost(postId: ID!, status: String, photo: String): message
   deletePost(postId: ID!, photo: String): message
   likePost(postId: ID!): message
   commentPost(postId: ID!, comment: String!): comment
   deleteComment(id: ID!, postId: ID!): message
  }
`;

export default postTypeDefs;