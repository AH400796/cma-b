const axios = require("axios");

const getPairOrders = async function () {
  const result = await axios.get("https://api.kraken.com/0/public/Ticker");
  return result.data;
};

const getWithdrawFeesList = async function () {
  const result = await axios.get("https://www.mexc.com/open/api/v2/market/coin/list");
  return result.data.data;
};

async function mexcData(data, exclusions) {
  const regEx = /USDT/;
  const fees = await getWithdrawFeesList();
  const mexcOrders = await getPairOrders();
  const mexcUSDTOrders = mexcOrders.filter(
    el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT") & !el.symbol.includes("3S") & !el.symbol.includes("3L")
  );

  mexcUSDTOrders.map(el => {
    const pair = el.symbol.replace(/USDT/g, "/USDT");

    if (exclusions.find(el => el.market === "MEXC" && el.pair === pair)) {
      return null;
    }
    const symbol = el.symbol.replace(/USDT/g, "_USDT");
    const feeSymbol = el.symbol.replace(/USDT/g, "");

    const coinFee = fees.filter(el => el.currency === feeSymbol);
    const feeArr = coinFee.length !== 0 ? coinFee[0].coins.map(el => [el.fee, feeSymbol, el.withdraw_limit_min, el.chain]) : [];
    const { askPrice, askQty, bidPrice, bidQty } = el;
    const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;

    const pairData = {
      market: "MEXC",
      url: `https://www.mexc.com/exchange/${symbol}`,
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

module.exports = mexcData;
