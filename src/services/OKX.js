const axios = require("axios");
// const crypto = require("crypto");

// const { OKXAPIKey, OKXAPISecret, OKXPassphrase } = process.env;

// const getWithdrawFeesList = async function () {
//   const timestamp = new Date(Date.now()).toISOString();

//   const string = timestamp + "GET" + `/api/v5/asset/currencies?ccy=BTC` + "";
//   const sign = crypto.createHmac("sha256", OKXAPISecret).update(string).digest("base64");

//   const config = {
//     method: "GET",
//     url: `https://www.okx.com/api/v5/asset/currencies?ccy=BTC`,
//     headers: {
//       "OK-ACCESS-KEY": OKXAPIKey,
//       "OK-ACCESS-SIGN": sign,
//       "OK-ACCESS-TIMESTAMP": timestamp,
//       "OK-ACCESS-PASSPHRASE": OKXPassphrase,
//     },
//   };
//   const result = await axios(config);
//   return result.data.data;
// };

const getPairOrders = async function () {
  const result = await axios.get(`https://www.okx.com/api/v5/market/tickers?instType=SPOT`);
  return result.data.data;
};

async function okxData(data, exclusions) {
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
    const { bidPx, bidSz, askPx, askSz } = el;
    const precision = Number(askPx) < 0.01 ? 0 : Number(Number(askPx).toFixed(1).toString().indexOf(".")) + 1;
    const pairData = {
      market: "OKX",
      url: `https://www.okx.com/ua/trade-spot/${el.instId}`,
      buyPrice: Number(askPx),
      buyQty: Number(Number(askSz).toFixed(precision)),
      sellPrice: Number(bidPx),
      sellQty: Number(Number(bidSz).toFixed(precision)),
      fee: [],
      withdrlUrl: `https://www.okx.com/ua/balance/withdrawal/${symbol}`,
      depUrl: `https://www.okx.com/balance/recharge/${symbol}`,
    };
    if (!data[pair]) {
      data[pair] = [];
    }
    data[pair].push(pairData);
    return null;
  });
}

module.exports = okxData;
