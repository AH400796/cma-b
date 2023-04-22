// const axios = require("axios");
// const exclusions = require("../exclusions/exclusions");
// const crypto = require("crypto");

// const { ByBitAPIKey, ByBitAPISecret } = process.env;

// const apiKey = ByBitAPIKey;
// const recvWindow = 30000;
// const timestamp = Date.now().toString();

// function getSignature(secret) {
//   return crypto
//     .createHmac("sha256", secret)
//     .update(timestamp + apiKey + recvWindow)
//     .digest("hex");
// }

// const getPairOrders = async function () {
//   const result = await axios.get("https://api.bybit.com/spot/v3/public/quote/ticker/bookTicker");
//   return result.data.result.list;
// };

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
//   try {
//     const result = await axios(config);
//     return result.data.result.rows;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// async function bybitData(data) {
//   const regEx = /USDT/;
//   const fees = await getWithdrawFeesList();
//   const bybitOrders = await getPairOrders();

//   const bybitUSDTOrders = bybitOrders.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));

//   bybitUSDTOrders.map(el => {
//     const pair = el.symbol.replace(/USDT/g, "/USDT");

// if (exclusions.BYBIT.includes(pair)) {
//   return null;
// }
//     const feeSymbol = el.symbol.replace(/USDT/g, "");

//     const coinFee = fees ? fees.filter(el => el.coin === feeSymbol) : {};

//     const feeArr =
//       !coinFee && coinFee.length !== 0
//         ? coinFee[0].chains.map(el => [el.withdrawFee, feeSymbol, el.withdrawMin, el.chain + " " + `(${el.chainType})`])
//         : [];
//     const { askPrice, askQty, bidPrice, bidQty } = el;
//     const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;
//     const pairData = {
//       market: "BYBIT",
//       url: `https://www.bybit.com/uk-UA/trade/spot/${pair}`,
//       buyPrice: Number(askPrice),
//       buyQty: Number(Number(askQty).toFixed(precision)),
//       sellPrice: Number(bidPrice),
//       sellQty: Number(Number(bidQty).toFixed(precision)),
//       fee: feeArr,
//     };
//     if (!data[pair]) {
//       data[pair] = [];
//     }
//     data[pair].push(pairData);
//     return null;
//   });
// }

// module.exports = bybitData;
