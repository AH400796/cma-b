const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;
const feesPath = path.join(__dirname, "../data/fees.json");

const getPairsList = async function () {
  const result = await axios.get("https://api.binance.com/api/v3/ticker/bookTicker");
  return result;
};

// Data processing
async function binanceData(data, exclusions) {
  const result = await fs.readFile(feesPath, "utf8");
  const fees = JSON.parse(result).binance || [];
  const regEx = /USDT/;

  const binancePairList = await getPairsList();
  const binanceUSDTPairs = binancePairList.data.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));

  binanceUSDTPairs.map(el => {
    const pair = el.symbol.replace(/USDT/g, "/USDT");
    if (exclusions.find(el => el.market === "BINANCE" && el.pair === pair)) {
      return null;
    }
    const symbol = el.symbol.replace(/USDT/g, "_USDT");
    const feeSymbol = el.symbol.replace(/USDT/g, "");
    const feeArr = fees.filter(el => el.symbol === feeSymbol).map(el => el.fee);
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
      withdrlUrl: `https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto/${feeSymbol}`,
      depUrl: `https://www.binance.com/en/my/wallet/account/main/deposit/crypto/${feeSymbol}`,
    };
    if (!data[pair]) {
      data[pair] = [];
    }
    data[pair].push(pairData);

    return null;
  });
}

module.exports = binanceData;
