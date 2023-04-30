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
