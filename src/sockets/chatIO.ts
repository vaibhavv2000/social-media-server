import {Server} from "socket.io";
import sql from "../config/sql";

interface user {
 userId: number;
 id: string;
};

let users: user[] = [];

const chatIO = (io: Server) => {
 io.on("connection", (socket) => {

  socket.on("join", (userId: number) => {
   users.push({id: socket.id, userId});
   sql.execute("UPDATE users SET isLive = true WHERE id = ?", [userId]);
  });

  socket.on("send-message", (message: string, sender: number, receiver: number) => {
   if(message && sender && receiver) {
    const user = users.find(item => item.userId === receiver);
    if(user) io.to(user.id).emit("get-message", message);
   };
  });

  socket.on("edit-message", () => {

  });

  socket.on("delete-message",() => {});
  
  socket.on("check-users", () => {});

  socket.on('disconnect', () => {
   const user = users.find(item => item.id === socket.id);
   if(user) {
    sql.execute("UPDATE users SET isLive = false WHERE id = ?", [user.userId]);
    users = users.filter(item => item.id !== socket.id);
   };
  });
 });
};

export default chatIO;