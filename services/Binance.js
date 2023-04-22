const axios = require("axios");
const exclusions = require("../exclusions/exclusions");
require("dotenv").config();

const Binance = require("binance-api-node").default;

const { BinanceAPIKey, BinanceAPIsecret } = process.env;

const client = Binance({
  apiKey: BinanceAPIKey,
  apiSecret: BinanceAPIsecret,
  getTime: Date.now,
});

const getPairsList = async function () {
  const result = await axios.get("https://api.binance.com/api/v3/ticker/bookTicker");
  return result;
};

const getWithdrawFeesList = async function () {
  const res = await client.capitalConfigs();
  const feesArr = [];
  res.map(el =>
    el.networkList.filter(el => {
      if (Number(el.withdrawMin) !== 0) {
        feesArr.push(el);
      }
      return null;
    })
  );
  const fees = feesArr.map(el => [Number(el.withdrawFee), el.coin, Number(el.withdrawMin), el.name]);
  return fees;
};

async function binanceData(data) {
  const regEx = /USDT/;
  const fees = await getWithdrawFeesList();
  const binancePairList = await getPairsList();
  const binanceUSDTPairs = binancePairList.data.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));

  binanceUSDTPairs.map(el => {
    const pair = el.symbol.replace(/USDT/g, "/USDT");
    if (exclusions.BINANCE.includes(pair)) {
      return null;
    }
    const symbol = el.symbol.replace(/USDT/g, "_USDT");
    const feeSymbol = el.symbol.replace(/USDT/g, "");
    const feeArr = fees.filter(el => el[1] === feeSymbol);
    const { askPrice, askQty, bidPrice, bidQty } = el;
    const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;

    const pairData = {
      market: "BINANCE",
      url: `https://www.binance.com/uk-UA/trade/${symbol}?theme=dark&type=spot`,
      buyPrice: Number(askPrice),
      buyQty: Number(Number(askQty).toFixed(precision)),
      sellPrice: Number(bidPrice),
      sellQty: Number(Number(bidQty).toFixed(precision)),
      fee: feeArr,
    };
    if (!data[pair]) {
      data[pair] = [];
    }
    data[pair].push(pairData);

    return null;
  });
}

module.exports = binanceData;
