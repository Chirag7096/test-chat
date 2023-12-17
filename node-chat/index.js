import { createServer } from "http";
import { Server } from "socket.io";
import db from "./db.config.js";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("user_list", async () => {
    const [data] = await db.query("SELECT * FROM users ");
    socket.emit("user_list_receive", { data });
  });
  socket.on("chanel_list", async (id) => {
    const [data] = await db.query(
      `SELECT * FROM chanel_user JOIN chanel ON chanel_user.chanel_id = chanel.id JOIN users ON chanel_user.user_id = users.id WHERE user_id != ${id} AND chanel_id IN (select chanel_id FROM chanel_user WHERE user_id = ${id})`
    );
    socket.emit("chanel_list_receive", { data });
  });
  socket.on("chanel_message", async (id) => {
    const [data] = await db.query(
      `SELECT * FROM messages WHERE chanel_id = ${id}`
    );
    socket.emit("chanel_message_receive", { data });
    socket.join("test1");
  });
  socket.on("new_message", async (data) => {
    const [res] = await db.query(
      `INSERT INTO messages (chanel_id, sender_id, message) VALUES ('${data?.chanel_id}','${data?.sender_id}','${data?.message}')`
    );
    socket.broadcast.emit("new_message_receive", { ...data, id: res.insertId });
    socket.emit("new_message_receive", { ...data, id: res.insertId });
  });
});

httpServer.listen(3000);
