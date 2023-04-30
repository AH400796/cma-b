// const axios = require("axios");
// const path = require("path");
// const fs = require("fs").promises;
// const feesPath = path.join(__dirname, "../data/fees.json");
// // const WebSocket = require("ws");
// // const crypto = require("crypto");
// // const { ByBitAPIKey, ByBitAPISecret } = process.env;
// // const apiKey = ByBitAPIKey;
// // const recvWindow = 59000;
// // const timestamp = Date.now().toString();

// const getPairOrders = async function () {
//   const result = await axios.get("https://api.bybit.com/spot/v3/public/quote/ticker/bookTicker");
//   return result.data.result.list;
// };
// // Data processing
// async function bybitData(data, exclusions) {
//   const result = await fs.readFile(feesPath, "utf8");
//   const fees = JSON.parse(result).bybit || [];
//   const regEx = /USDT/;
//   const bybitOrders = await getPairOrders();
//   const bybitUSDTOrders = bybitOrders.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));

//   bybitUSDTOrders.map(el => {
//     const pair = el.symbol.replace(/USDT/g, "/USDT");
//     if (exclusions.find(el => el.market === "BYBIT" && el.pair === pair)) {
//       return null;
//     }

//     const symbol = el.symbol.replace(/USDT/g, "");
//     const bybitFee = fees.filter(el => el.symbol === symbol).map(el => el.fee);
//     const { askPrice, askQty, bidPrice, bidQty } = el;
//     const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;
//     const pairData = {
//       market: "BYBIT",
//       url: `https://www.bybit.com/uk-UA/trade/spot/${pair}`,
//       buyPrice: Number(askPrice),
//       buyQty: Number(Number(askQty).toFixed(precision)),
//       sellPrice: Number(bidPrice),
//       sellQty: Number(Number(bidQty).toFixed(precision)),
//       fee: bybitFee,
//       withdrlUrl: `https://www.bybit.com/user/assets/home/spot`,
//       depUrl: `https://www.bybit.com/user/assets/home/spot`,
//     };
//     if (!data[pair]) {
//       data[pair] = [];
//     }
//     data[pair].push(pairData);
//     return null;
//   });

//   // const client = new WebSocket("wss://stream.bybit.com/spot/public/v3");
//   //   client.on("open", function () {
//   //     setInterval(() => {
//   //       client.ping();
//   //     }, 20000);
//   //     client.ping();
//   //     client.send(JSON.stringify({ op: "subscribe", args: [`orderbook.1.${el.symbol}`] }));
//   //   });
//   //   client.on("message", function (data) {
//   //   console.log(Buffer.from(data).toString());
//   //   console.log("===/", JSON.parse(Buffer.from(data).toString()));
//   // const pair = "ETHUSDT";
//   // const client = new WebSocket("wss://stream.bybit.com/spot/public/v3");
//   // client.on("open", function () {
//   //   setInterval(() => {
//   //     client.ping();
//   //   }, 20000);
//   //   client.ping();
//   //   client.send(JSON.stringify({ op: "subscribe", args: [`orderbook.5.${pair}`] }));
//   // });
//   // client.on("message", function (data) {
//   //   console.log("===/", JSON.parse(Buffer.from(data).toString()).data.s);
//   // });
// }

// module.exports = bybitData;
