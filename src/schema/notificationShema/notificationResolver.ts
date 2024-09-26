import deleteNotification from "./mutation/deleteNotification";
import newNotification from "./mutation/newNotification";
import getNotifications from "./query/getNotifications";

const notificationResolver = {
 ACTIONTYPE: {
  LIKE: "like",
  COMMENT: "comment",
  FOLLOW: "follow",
 },
 Query: {
  getNotifications,
 },
 Mutation: {
   newNotification,
   deleteNotification
 },
};

export default notificationResolver;