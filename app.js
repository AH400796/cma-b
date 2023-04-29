const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const cryptoRouter = require("./src/routes/api/cryptos");

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/cma", cryptoRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});

module.exports = app;
