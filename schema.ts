/*

query User($username: String!) {
  get_user(username: $username) {
    email followers
  }

  get_recommended_users {
    name id
  }
}

query Post($postId: ID, $id: ID, $explore: Boolean, $skip: Int) {
  get_random_photos(explore: $explore, skip: $skip) {
    photo
  }

  get_timeline_posts {
    id
    status
  }

  get_user_posts(id: $id) {
    id
    userId
  }

  get_single_post(postId: $postId) {
    likes
    comments
    status
  }
}

mutation($status: String, $photo: String, $postId: ID!, $editPostPostId2: ID!, $editPostStatus2: String, $editPostPhoto2: String, $likePostPostId2: ID!, $commentPostPostId2: ID!, $comment: String!, $deleteCommentPostId2: ID!, $deleteCommentComment2: String!) {
  update_user(name: "eren", password: "schusc") {
    username
  }

  add_post(status: $status, photo: $photo) {
    userId status bookmarks comments likes
  }

  edit_post(postId: $editPostPostId2, status: $editPostStatus2, photo: $editPostPhoto2) {
    msg
  }

  delete_post(postId: $postId) {
    msg
  }

  like_post(postId: $likePostPostId2) {
    msg
  }
  
  comment_post(postId: $commentPostPostId2, comment: $comment) {
    msg
  }

  delete_comment(postId: $deleteCommentPostId2, comment: $deleteCommentComment2) {
    msg
  }
}

*/