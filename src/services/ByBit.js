const axios = require("axios");
const WebSocket = require("ws");
// const crypto = require("crypto");

// const { ByBitAPIKey, ByBitAPISecret } = process.env;

// const apiKey = ByBitAPIKey;
// const recvWindow = 59000;
// const timestamp = Date.now().toString();

// function getSignature(secret) {
//   return crypto
//     .createHmac("sha256", secret)
//     .update(timestamp + apiKey + recvWindow)
//     .digest("hex");
// }

const getPairOrders = async function () {
  const result = await axios.get("https://api.bybit.com/spot/v3/public/quote/ticker/bookTicker");
  return result.data.result.list;
};

// const getWithdrawFeesList = async function () {
//   const sign = getSignature(ByBitAPISecret);
//   const config = {
//     method: "GET",
//     url: "https://api.bybit.com/asset/v3/private/coin-info/query",
//     headers: {
//       "X-BAPI-SIGN-TYPE": "2",
//       "X-BAPI-SIGN": sign,
//       "X-BAPI-API-KEY": apiKey,
//       "X-BAPI-TIMESTAMP": timestamp,
//       "X-BAPI-RECV-WINDOW": "30000",
//       "Content-Type": "application/json; charset=utf-8",
//     },
//   };
//   const result = await axios(config);
//   return result.data.result.rows;
// };

async function bybitData(data, exclusions) {
  const regEx = /USDT/;

  const bybitOrders = await getPairOrders();
  console.log(bybitOrders);
  const bybitUSDTOrders = bybitOrders.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));

  bybitUSDTOrders.map(el => {
    const pair = el.symbol.replace(/USDT/g, "/USDT");
    if (exclusions.find(el => el.market === "BYBIT" && el.pair === pair)) {
      return null;
    }

    // const client = new WebSocket("wss://stream.bybit.com/spot/public/v3");
    // client.on("open", function () {
    //   setInterval(() => {
    //     client.ping();
    //   }, 20000);
    //   client.ping();
    //   client.send(JSON.stringify({ op: "subscribe", args: [`orderbook.1.${el.symbol}`] }));
    // });
    // client.on("message", function (data) {
    // console.log(Buffer.from(data).toString());
    // console.log("===/", JSON.parse(Buffer.from(data).toString()));

    // const feeSymbol = el.symbol.replace(/USDT/g, "");

    // const coinFee = fees.filter(el => el.coin === feeSymbol);

    // const feeArr =
    //   coinFee.length !== 0 ? coinFee[0].chains.map(el => [el.withdrawFee, feeSymbol, el.withdrawMin, el.chain + " " + `(${el.chainType})`]) : [];
    // const { askPrice, askQty, bidPrice, bidQty } = el;
    // const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;
    // const pairData = {
    //   market: "BYBIT",
    //   url: `https://www.bybit.com/uk-UA/trade/spot/${pair}`,
    //   buyPrice: Number(askPrice),
    //   buyQty: Number(Number(askQty).toFixed(precision)),
    //   sellPrice: Number(bidPrice),
    //   sellQty: Number(Number(bidQty).toFixed(precision)),
    // fee: feeArr,
    // };
    // if (!data[pair]) {
    //   data[pair] = [];
    // }
    // data[pair].push(pairData);
    return null;
  });
  const pair = "ETHUSDT";

  const client = new WebSocket("wss://stream.bybit.com/spot/public/v3");
  client.on("open", function () {
    setInterval(() => {
      client.ping();
    }, 20000);
    client.ping();
    client.send(JSON.stringify({ op: "subscribe", args: [`orderbook.5.${pair}`] }));
  });
  client.on("message", function (data) {
    console.log("===/", JSON.parse(Buffer.from(data).toString()).data.s);
  });
}

module.exports = bybitData;
