const mongoose = require("mongoose");
const app = require("./app");
const getData = require("./data");
require("dotenv").config();

const { DB_HOST, PORT = 3010 } = process.env;

mongoose.set("strictQuery", true);
let setIntName;
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected. Server running at port ${PORT}.`);
    });
    getData();

    // const fetchData = async () => {
    //   await getData();
    // };
    // const interval = setInterval(() => {
    //   fetchData();
    // }, 30000);
    // setIntName = interval;
  })
  .catch(error => {
    console.log(error.message);
    clearInterval(setIntName);
    process.exit(1);
  });
