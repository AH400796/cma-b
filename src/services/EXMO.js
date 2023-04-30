const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;
const feesPath = path.join(__dirname, "../data/fees.json");

const getPairsList = async function () {
  try {
    const result = await axios.get("https://api.exmo.com/v1.1/ticker");
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const getPairOrders = async function (pair) {
  try {
    const result = await axios.get(`https://api.exmo.com/v1.1/order_book?pair=${pair}&limit=1000`);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};
// Data processing
async function exmoData(data, exclusions) {
  try {
    const result = await fs.readFile(feesPath, "utf8");
    const fees = JSON.parse(result).exmo || [];
    const regEx = /_USDT/;

    const exmoPairList = await getPairsList();
    const exmoUSDTPairs = Object.keys(exmoPairList.data).filter(el => regEx.test(el));
    const orderBooks = await getPairOrders(exmoUSDTPairs.join(","));

    exmoUSDTPairs.map(el => {
      const pair = el.replace(/_/g, "/");
      const symbol = el.replace(regEx, "");
      if (exclusions.find(el => el.market === "EXMO" && el.pair === pair)) {
        return null;
      }
      const bidPrice = orderBooks.data[el].bid[0][0];
      const bidQty = orderBooks.data[el].bid[0][1];
      const askPrice = orderBooks.data[el].ask[0][0];
      const askQty = orderBooks.data[el].ask[0][1];
      const exmoFees = fees.filter(el => el.symbol === symbol).map(el => el.fee);
      const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;

      const pairData = {
        market: "EXMO",
        url: `https://exmo.com/trade/${el}`,
        buyPrice: Number(askPrice),
        buyQty: Number(Number(askQty).toFixed(precision)),
        sellPrice: Number(bidPrice),
        sellQty: Number(Number(bidQty).toFixed(precision)),
        fee: exmoFees,
        withdrlUrl: `https://exmo.com/wallet/withdrawal/${symbol}`,
        depUrl: `https://exmo.com/wallet/deposit/${symbol}`,
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

module.exports = exmoData;
