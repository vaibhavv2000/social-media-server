export interface user {
 id: number;
 name: string;
 username: string;
 email: string;
 password: string;
 followers: number;
 followings: number;
 posts: number;
 profile: number; 
 cover: number;
 bio: number;
};

export interface post {
 id: number;
 userId: number;
 status: string;
 photo: string;
 likes: number; 
 comments: number; 
 bookmarks: number;
 created_at:string;
};

export interface followings {
 id: number;
 followerId: number;
 followingId: number;
};

export interface notification {
 id: number;
 action_type: "like" | "comment" | "follow";
 toWhom: number;
 byWhom: number;
 postId: number;
};