const axios = require("axios");

const getPairOrders = async function () {
  const result = await axios.get("https://api.mexc.com/api/v3/ticker/bookTicker");
  return result.data;
};

const getWithdrawFeesList = async function () {
  const result = await axios.get("https://www.mexc.com/open/api/v2/market/coin/list");
  return result.data.data;
};

async function mexcData(data) {
  const regEx = /USDT/;
  const mexcOrders = await getPairOrders();
  const mexcUSDTOrders = mexcOrders.filter(el => regEx.test(el.symbol) & (Number(el.bidPrice) !== 0) & !el.symbol.startsWith("USDT"));
  const fees = await getWithdrawFeesList();

  mexcUSDTOrders.map(el => {
    const pair = el.symbol.replace(/USDT/g, "/USDT");
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
