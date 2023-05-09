// const WebSocketServer = new require("ws");

// const wss = new WebSocketServer.Server({ port: 8080 });

// const clients = [];

// wss.on("connection", ws => {
//   const id = clients.length;
//   clients[id] = ws;
//   console.log(`New connect ${id}`);

//   clients[id].send(`Your number is ${id}`);

//   clients.forEach((item, index) => {
//     if (index !== id) {
//       item.send(`Number ${id} connected to our`);
//     }
//   });
// });

// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server);

// server.listen(process.env.PORT || 3030, function () {
//   console.log("Server running in port 3030");
// });

// const transferData = data => {};
