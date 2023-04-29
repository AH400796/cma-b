const exmoData = require("./EXMO");
const binanceData = require("./Binance");
const mexcData = require("./MEXC");
const bybitData = require("./ByBit");
const krakenData = require("./Kraken");
const okxData = require("./OKX");
const { kucoinData, getPairOrders, getWithdrawFeesList } = require("./Kucoin");

module.exports = {
  exmoData,
  binanceData,
  mexcData,
  bybitData,
  krakenData,
  okxData,

  kucoinData,
  getPairOrders,
  getWithdrawFeesList,
};
