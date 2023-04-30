const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;
const feesPath = path.join(__dirname, "../data/fees.json");

const getPairOrders = async function () {
  try {
    const result = await axios.get("https://api.mexc.com/api/v3/ticker/bookTicker");
    return result.data;
  } catch (error) {
    console.log(error.message);
  }
};

// Data processing
async function mexcData(data, exclusions) {
  try {
    const result = await fs.readFile(feesPath, "utf8");
    const fees = JSON.parse(result).mexc || [];
    const regEx = /USDT/;
    const mexcOrders = await getPairOrders();
    const mexcUSDTOrders = mexcOrders.filter(
      el =>
        regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT") & !el.symbol.includes("3S") & !el.symbol.includes("3L")
    );

    mexcUSDTOrders.map(el => {
      const pair = el.symbol.replace(/USDT/g, "/USDT");
      if (exclusions.find(el => el.market === "MEXC" && el.pair === pair)) {
        return null;
      }
      const symbol = el.symbol.replace(/USDT/g, "_USDT");
      const feeSymbol = el.symbol.replace(/USDT/g, "");
      const mexcFee = fees.filter(el => el.symbol === feeSymbol).map(el => el.fee);
      const { askPrice, askQty, bidPrice, bidQty } = el;
      const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;

      const pairData = {
        market: "MEXC",
        url: `https://www.mexc.com/exchange/${symbol}`,
        buyPrice: Number(askPrice),
        buyQty: Number(Number(askQty).toFixed(precision)),
        sellPrice: Number(bidPrice),
        sellQty: Number(Number(bidQty).toFixed(precision)),
        fee: mexcFee,
        withdrlUrl: `https://www.mexc.com/assets/withdraw/${feeSymbol}`,
        depUrl: `https://www.mexc.com/assets/deposit/${feeSymbol}`,
      };
      if (!data[pair]) {
        data[pair] = [];
      }
      data[pair].push(pairData);
      return null;
    });
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = mexcData;
