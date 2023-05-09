const mongoose = require("mongoose");
const app = require("./app");
const logger = require("morgan");
// const { getData } = require("./src/data");
const { getWithdrawFeesList } = require("./src/data");
require("dotenv").config();

const http = require("http");
app.use(logger("dev"));

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const { DB_HOST, PORT = 3010 } = process.env;

mongoose.set("strictQuery", true);
let setIntName;
// let data = {};
// const users = [];

mongoose
  .connect(DB_HOST)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`DB connected. Server running at port ${PORT}.`);
    });
    getWithdrawFeesList();
    io.disconnectSockets();
    // io.sockets.on("connection", async client => {
    //   users.push(client.id);
    //   console.log(`${users.length} users connected`);
    //   console.table(users);

    //   data = await getData();
    //   client.emit("updatedData", data);

    //   const fetchData = async () => {
    //     data = await getData();
    //     client.emit("updatedData", data);
    //     console.log(`${client.id} recived updated data`);
    //   };

    //   const interval = setInterval(() => {
    //     fetchData();
    //   }, 10000);
    //   setIntName = interval;

    //   client.on("disconnect", () => {
    //     clearInterval(setIntName);
    //     const index = users.indexOf(client.id);
    //     users.splice(index, 1);
    //     console.log(`${users.length} users connected: user ${client.id} disconnected`);
    //     console.table(users);
    //   });
    // });
  })
  .catch(error => {
    console.log(error.message);
    clearInterval(setIntName);
    process.exit(1);
  });

// const mongoose = require("mongoose");
// const app = require("./app");
// const { getData } = require("./src/data");
// const { getWithdrawFeesList } = require("./src/data");
// require("dotenv").config();

// const { DB_HOST, PORT = 3010 } = process.env;

// mongoose.set("strictQuery", true);
// let setIntName;

// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`DB connected. Server running at port ${PORT}.`);
//     });
//     getWithdrawFeesList();
//     getData();
//     if (PORT !== 3010) {
//       const fetchData = async () => {
//         await getData();
//       };
//       const interval = setInterval(() => {
//         fetchData();
//       }, 30000);
//       setIntName = interval;
//     }
//   })
//   .catch(error => {
//     console.log(error.message);
//     clearInterval(setIntName);
//     process.exit(1);
//   });
