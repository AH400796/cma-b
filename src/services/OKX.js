const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;
const feesPath = path.join(__dirname, "../data/fees.json");

const getPairOrders = async function () {
  const result = await axios.get(`https://www.okx.com/api/v5/market/tickers?instType=SPOT`);
  return result.data.data;
};
// Data processing
async function okxData(data, exclusions) {
  const result = await fs.readFile(feesPath, "utf8");
  const fees = JSON.parse(result).okx || [];
  const regEx = /USDT/;
  const okxPairOrders = await getPairOrders();

  const okxUSDTOrders = okxPairOrders.filter(
    el =>
      regEx.test(el.instId) &
      (Number(el.askPx) !== 0) &
      (Number(el.bidPx) !== 0) &
      !el.instId.startsWith("USDT") &
      !el.instId.includes("3S") &
      !el.instId.includes("3L")
  );
  okxUSDTOrders.map(el => {
    const pair = el.instId.replace(/-USDT/g, "/USDT");
    const symbol = el.instId.replace(/-USDT/g, "");
    if (exclusions.find(el => el.market === "OKX" && el.pair === pair)) {
      return null;
    }
    const okxFee = fees.filter(el => el.symbol === symbol).map(el => el.fee);

    const { bidPx, bidSz, askPx, askSz } = el;
    const precision = Number(askPx) < 0.01 ? 0 : Number(Number(askPx).toFixed(1).toString().indexOf(".")) + 1;
    const pairData = {
      market: "OKX",
      url: `https://www.okx.com/ua/trade-spot/${el.instId}`,
      buyPrice: Number(askPx),
      buyQty: Number(Number(askSz).toFixed(precision)),
      sellPrice: Number(bidPx),
      sellQty: Number(Number(bidSz).toFixed(precision)),
      fee: okxFee,
      withdrlUrl: `https://www.okx.com/ua/balance/withdrawal/${symbol.toLowerCase()}`,
      depUrl: `https://www.okx.com/balance/recharge/${symbol.toLowerCase()}`,
    };
    if (!data[pair]) {
      data[pair] = [];
    }
    data[pair].push(pairData);
    return null;
  });
}

module.exports = okxData;
