import {GraphQLError} from "graphql";
import sql from "../config/sql";
import {removeImage} from "../config/upload";

export const postTypeDefs = `#graphql
 
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

  type msg {
   msg: String
  }

  type comment {
   id: ID
   postId: ID
   comment: String
   userInteracted: ID
   username: String
  }

  type Query {
   get_timeline_posts: [post]
   get_random_photos(explore: Boolean,skip: Int, username: String): [photo]
   get_user_posts(id: ID!): [post]
   get_single_post(postId: ID!): post
   get_comments(postId: ID!): [comment]
  }

  type Mutation {
   add_post(status: String,photo: String): post
   edit_post(postId: ID!,status: String,photo: String): msg
   delete_post(postId: ID!, photo: String): msg
   like_post(postId: ID!): msg
   comment_post(postId: ID!, comment: String!): msg
   delete_comment(postId: ID!, comment: String!): msg
  }
`;

export const postResolver = {
 Query: {
  get_timeline_posts: async (_: any,args: any,context: any) => {
   const {id} = context.user;

   try {
    const photos = await sql.execute(
     `SELECT p.*,u.name,u.username,u.profile FROM posts p 
      INNER JOIN users u ON p.userid = u.id 
      WHERE userId IN (SELECT followingId FROM followings WHERE followerId = ?) 
      UNION ALL 
      SELECT posts.*,users.name,users.username,users.profile FROM posts 
      INNER JOIN users ON posts.userId = users.id WHERE userid = ?
      ORDER BY id DESC
     `,
     [id,id]
    ) as any;

    const data = await Promise.all(photos[0].map(async (p: any) => {
     const is_liked = await sql.execute(
      `SELECT * FROM postinteract WHERE postId = ? AND userInteracted = ?`,
      [p.id,id]
     ) as any;

     const like = is_liked[0][0];
     const isLiked = like ? true : false;

     return {...p,isLiked};
    }));

    return data;
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  get_random_photos: async (_: any,args: {explore: boolean; skip: number; username: string}) => {
   const {explore,skip = 0,username} = args;

   try {
    if(username) {
     const photos = await sql.execute(
      `SELECT photo, id as postId FROM posts 
       WHERE photo != '' AND userId = (SELECT id FROM users WHERE username = ?)
       ORDER BY created_at`,
      [username]
     );

     return photos[0];
    };

    if(explore) {
     const photos = await sql.execute(
      `SELECT photo, id as postId FROM posts WHERE photo != '' 
       ORDER BY RAND() LIMIT 50 OFFSET ${skip}`
     );

     return photos[0];
    } else {
     const photos = await sql.execute(
      `SELECT photo, id as postId FROM posts WHERE photo != '' ORDER BY RAND() LIMIT 6`
     );

     return photos[0];
    };
   } catch(error:any) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  get_user_posts: async (_: any,args: {id: number}) => {
   const {id} = args;
  
   try {
    const photos = await sql.execute(`SELECT * FROM posts WHERE id = ?`,[id]);
    return photos[0];
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  get_single_post: async (_: any,{postId}: {postId: number}) => {
   try {
    const get_post = await sql.execute(
     `SELECT p.*,u.name,u.username,u.profile FROM posts p 
      INNER JOIN  
      users u ON p.userId = u.id
      WHERE p.id = ?
     `,
     [postId]
    ) as any;

    let post = get_post[0][0];

    if(!post) {
     throw new GraphQLError("No post found",{
      extensions: {
       http: {status: 404},
       code: "NOT_FOUND",
      },
     });
    };

    return post;
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  get_comments: async (_: any,{postId}: {postId: number}) => {
   try {
    const comments = await sql.execute(
     `SELECT p.id, postId, comment, userInteracted, username 
      FROM postinteract as p 
      INNER JOIN users ON p.userInteracted = users.id 
      WHERE postId = ? AND comment != ''`,
     [postId]
    );

    return comments[0];
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },
 },

 Mutation: {
  add_post: async (
   _: any,
   args: {status: string; photo: string},
   context: any
  ) => {
   const {id} = context.user;

   const {status = "",photo = ""} = args;
   const pool = await sql.getConnection();

   try {
    await pool.beginTransaction();

    await sql.execute(
     `INSERT INTO posts (status, photo, userId) VALUES (?,?,?)`,
     [status,photo,id]
    );

    const postId = await sql.execute(`SELECT LAST_INSERT_ID() as id`) as any;

    await pool.commit();

    let p_id = postId[0][0].id;

    return {
     id: p_id,
     status,
     photo,
     userId: id,
     likes: 0,
     comments: 0,
     bookmarks: 0,
    };
   } catch(error) {
    await pool.rollback();
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  edit_post: async (
   _: any,
   args: {postId: number; status: string; photo: string}
  ) => {
   const {postId,status = "",photo = ""} = args;

   try {
    if(photo) {
     await sql.execute(
      `UPDATE posts SET status = ?, photo = ? WHERE id = ?`,
      [status,photo,postId]
     );

     return {msg: "Post updated"};
    } else {
     await sql.execute(
      `UPDATE posts SET status = ? WHERE id = ?`,
      [status,postId]
     );

     return {msg: "Post updated"};
    }
   } catch(error) {
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  delete_post: async (_: any,args: any,context: any) => {
   const {id} = context.user;
   const {postId, photo} = args;

   const pool = await sql.getConnection();
   try {
    await pool.beginTransaction();
    await sql.execute(`DELETE FROM posts WHERE id = ? AND userId = ?`,[postId,id]);
    await sql.execute(`UPDATE users SET posts = posts - 1 WHERE id = ?`,[id])

    await pool.commit();
    if(photo) removeImage(photo);
    return {msg: "Post deleted"};
   } catch(error) {
    await pool.rollback();
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  like_post: async (_: any,{postId}: {postId: number},context: any) => {
   const {id} = context.user;
   const pool = await sql.getConnection();

   try {
    await pool.beginTransaction();
    const checkPost = await sql.execute(
     `SELECT liked from postInteract 
      WHERE postId = ? AND userInteracted = ? AND liked = true`,
      [postId,id]
    ) as any;

    let isLiked = checkPost[0][0];

    if(isLiked) {
     await sql.execute(
      `UPDATE posts SET likes = likes - 1 WHERE id = ?`,
      [postId]
     );

     await sql.execute(
      `DELETE FROM postInteract WHERE postId = ? AND userInteracted = ?`,
      [postId,id]
     );

     await pool.commit();
     return {msg: "Post Unliked"};
    } else {
     await sql.execute(
      `UPDATE posts SET likes = likes + 1 WHERE id = ?`,
      [postId]
     );

     await sql.execute(
      `INSERT INTO postInteract (postId, liked, userInteracted) VALUES (?,?,?)`,
      [postId,true,id]
     );

     await pool.commit();
     return {msg: "Post Liked"};
    }
   } catch(error) {
    await pool.rollback();
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  comment_post: async (_: any,args: {postId: number; comment: string},context: any) => {
   const {postId,comment} = args;
   const {id} = context.user;
   const pool = await sql.getConnection();

   try {
    await pool.beginTransaction();
    await sql.execute(
     `INSERT INTO postInteract (postId, comment, userInteracted) 
      VALUES (?,?,?)`,
      [postId,comment,id]
    );

    await sql.execute(
     `UPDATE posts SET comments = comments + 1 WHERE id = ?`,
     [postId]
    );

    await pool.commit();
    return {msg: "Commented"};
   } catch(error) {
    await pool.rollback();
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },

  delete_comment: async (_: any,args: {comment: string; postId: number}) => {
   const {comment,postId,} = args;
   const pool = await sql.getConnection();

   try {
    await pool.beginTransaction();
    await sql.execute(
     `DELETE FROM postinteract WHERE postId = ? AND comment = ?`,
     [postId,comment]
    );

    await sql.execute(
     `UPDATE posts SET comments = comments - 1 WHERE id = ?`,
     [postId]
    );

    await pool.commit();
    return {msg: "Comment Deleted"};
   } catch(error) {
    await pool.rollback();
    if(error instanceof Error) throw new GraphQLError(error.message);
   }
  },
 },
};