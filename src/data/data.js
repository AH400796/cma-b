const { getExclusions } = require("../controllers/exclusions");
// const WebSocket = require("ws");

const {
  exmoData,
  binanceData,
  mexcData,
  okxData,
  // bybitData
  // kucoinData,
} = require("../services");

const { arbitrage } = require("../helpers");
const path = require("path");
const fs = require("fs").promises;
const arbPath = path.join(__dirname, "./arb.json");
const dataPath = path.join(__dirname, "./data.json");

const getData = async () => {
  const exclusions = (await getExclusions()) || [];
  const data = {};
  await exmoData(data, exclusions);
  await binanceData(data, exclusions);
  await mexcData(data, exclusions);
  await okxData(data, exclusions);
  // await kucoinData(data, exclusions);
  // await bybitData(data,exclusions);

  // const endpoint = "wss://stream-testnet.bybit.com/contract/usdt/public/v3";
  // console.log("attempting to connect to WebSocket %j", endpoint);
  // const client = new WebSocket(endpoint);
  // client.on("open", function () {
  //   console.log('"open" event!');
  //   console.log("WebSocket Client Connected");
  //   setInterval(() => {
  //     client.ping();
  //   }, 20000);
  //   client.ping();
  //   client.send(JSON.stringify({ op: "subscribe", args: ["orderbook.25.BTCUSDT"] }));
  // });

  // client.on("message", function (data) {
  //   console.log('"message" event! %j', JSON.parse(Buffer.from(data).toString()));
  // });
  // client.on("ping", function (data, flags) {
  //   console.log("ping received");
  // });
  // client.on("pong", function (data, flags) {
  //   console.log("pong received");
  // });

  const date = Date.now();
  const arb = arbitrage(data);
  const sortData = arb.filter(el => el !== null).sort((a, b) => b[1] - a[1]);
  fs.writeFile(dataPath, JSON.stringify(data), "utf8");
  fs.writeFile(arbPath, JSON.stringify({ date, sortData }), "utf8");
};

module.exports = getData;
