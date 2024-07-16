import {GraphQLError} from "graphql";
import sql from "../config/sql";

export const userTypeDefs = `#graphql

   interface User_types {
    id: ID
    name: String
    username: String
    email: String
    profile: String
   }

   type User {
    id: ID
    name: String
    username: String
    profile: String
    email: String
    bio: String
    cover: String
    posts: Int
    followers: Int
    followings: Int
   }

   type user_data implements User_types {
    id: ID
    name: String
    username: String
    email: String
    bio: String
    profile: String
    cover: String
    posts: Int
    followers: Int
    followings: Int
    isFollowing: Boolean
   }

   type msg {
    msg: String
   }

   type Query {
    get_user(username: String!): user_data
    get_recommended_users(query: String): [User]
    get_user_data: User
   }

   type Mutation {
    update_user(name: String, username: String, email: String, password: String, bio: String, profile: String, cover: String): User
    follow_user(userId: ID!): msg
   }
`;

export const userResolvers = {
  Query: {
    get_user: async (_: any,{username}: {username: string},context: any) => {
      const {id} = context.user;

      try {
        const [rows,data] = await sql.execute(
          `SELECT id, name, bio, email, username, posts, followers, followings,
           cover, profile 
           FROM    
           users WHERE username = ? LIMIT 1`,
          [username]
        );

        // @ts-ignore
        let user = rows[0];

        if(!user) {
          throw new GraphQLError("No user found",{
            extensions: {
              http: {status: 404},
              status: "NOT_FOUND",
            },
          });
        }

        const follow = await sql.execute(
          `SELECT * FROM followings WHERE followerId = ? AND followingId = ?`,
          [id,user.id]
        );

        // @ts-ignore
        let isFollowing = follow[0][0];

        if(isFollowing) user.isFollowing = true;
        else user.isFollowing = false;

        return user;
      } catch(error) {
        if(error instanceof Error) throw new GraphQLError(error.message);
      }
    },

    get_recommended_users: async (
      _: any,
      {query}: {query: string},
      context: any
    ) => {
      const {id} = context.user;

      try {
        if(query) {
          const search_users = await sql.execute(
            `SELECT name, username, id, profile FROM users 
             WHERE name LIKE ? OR username = ? AND id != ? LIMIT 10`,
            [`%${query}%`,`%${query}%`,id]
          );

          // @ts-ignore
          return search_users[0];
        } else {
          const random_users = await sql.execute(
            `SELECT name, username, id, profile FROM users 
             WHERE id != ? ORDER BY RAND() LIMIT 4`,
            [id]
          );

          // @ts-ignore
          return random_users[0];
        }
      } catch(error) {
        if(error instanceof Error) throw new GraphQLError(error.message,{
          extensions: {
            code: "Server error",
            http: {
              status: 500
            }
          }
        });
      }
    },

    get_user_data: async (_: any,__: any,context: any) => {
      const {id} = context.user;

      try {
        const user = await sql.execute(`SELECT * FROM users WHERE id = ?`,[id]);

        // @ts-ignore
        return user[0][0];
      } catch(error) {
        if(error instanceof Error) throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    update_user: async (_: any,args: any,context: any) => {
      const {id} = context.user;

      let {name,username,email,bio,profile = "",cover = ""} = args;

      try {
        await sql.execute(
          `UPDATE users SET name = ?, username = ?, email = ?, bio = ?,   
           profile = ?, cover = ? WHERE id = ?`,
          [name,username,email,bio,profile,cover,id]
        );

        const user = await sql.execute(
          `SELECT name, email, username, profile, cover, bio FROM users
           WHERE id = ?`,
          [id]
        );

        // @ts-ignore
        return user[0][0];
      } catch(error) {
        if(error instanceof Error) throw new GraphQLError(error.message);
      }
    },

    follow_user: async (_: any,args: {userId: number},context: any) => {
      const {id} = context.user;

      const {userId} = args;

      const pool = await sql.getConnection();

      try {
        await pool.beginTransaction();
        const data = await sql.execute(
          `SELECT id FROM followings WHERE followerId = ? AND followingId = ?`,
          [id,userId]
        );

        // @ts-ignore
        let isFollowing = data[0][0];

        if(isFollowing) {
          await sql.execute(
            `DELETE FROM followings WHERE followerId = ? AND followingId = ?`,
            [id,userId]
          );

          await sql.execute(
            `UPDATE users SET followers = followers - 1 WHERE id = ?`,
            [userId]
          );

          await sql.execute(
            `UPDATE users SET followings = followings - 1 WHERE id = ?`,
            [id]
          );

          await pool.commit();

          return {msg: "Unfollowed"};
        } else {
          await sql.execute(
            `INSERT INTO followings (followerId, followingId) VALUES (?,?)`,
            [id,userId]
          );

          await sql.execute(
            `UPDATE users SET followers = followers + 1 WHERE id = ?`,
            [userId]
          );

          await sql.execute(
            `UPDATE users SET followings = followings + 1 WHERE id = ?`,
            [id]
          );

          await pool.commit();

          return {msg: "Followed"};
        }
      } catch(error) {
        await pool.rollback();
        if(error instanceof Error) throw new GraphQLError(error.message);
      }
    },
  },
};
