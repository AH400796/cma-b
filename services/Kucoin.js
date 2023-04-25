const axios = require("axios");
// const crypto = require("crypto");

// const { KucoinAPIKey, KucoinAPISecret, Passphrase } = process.env;

const getPairPrices = async function () {
  const result = await axios.get("https://api.kucoin.com/api/v1/market/allTickers");
  return result.data.data.ticker;
};

const getWithdrawFeesList = async function (pair) {
  const result = await axios.get(`https://api.kucoin.com/api/v1/currencies/${pair}`);
  return result.data.data;
};

const getPairOrders = async function (pair) {
  const result = await axios.get(`https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${pair}`);
  return result.data.data;
};

// const getPairOrders = async function (pair) {
//   const timestamp = Date.now().toString();
//   const string = timestamp + "GET" + `/api/v3/market/orderbook/level2?symbol=${pair}`;
//   const sign = crypto.createHmac("sha256", KucoinAPISecret).update(string).digest("base64");
//   const encryptedPassphrase = crypto.createHmac("sha256", KucoinAPISecret).update(Passphrase).digest("base64");
//   const config = {
//     method: "GET",
//     url: `https://api.kucoin.com/api/v3/market/orderbook/level2?symbol=${pair}`,
//     headers: {
//       "KC-API-SIGN": sign,
//       "KC-API-TIMESTAMP": timestamp,
//       "KC-API-KEY": KucoinAPIKey,
//       "KC-API-PASSPHRASE": encryptedPassphrase,
//       "KC-API-KEY-VERSION": "2",
//     },
//   };
//   const result = await axios(config);
//   return result.data.data;
// };

async function kucoinData(data, exclusions) {
  const regEx = /USDT/;
  const kucoinOrders = await getPairPrices();

  const kucoinUSDTOrders = kucoinOrders.filter(
    el =>
      regEx.test(el.symbol) &
      (Number(el.buy) !== 0) &
      (Number(el.sell) !== 0) &
      !el.symbol.startsWith("USDT") &
      !el.symbol.includes("3S") &
      !el.symbol.includes("3L")
  );

  kucoinUSDTOrders.map(el => {
    const pair = el.symbol.replace(/-USDT/g, "/USDT");
    if (exclusions.find(el => el.market === "KUCOIN" && el.pair === pair)) {
      return null;
    }

    const { sell, buy } = el;
    const precision = Number(sell) < 0.01 ? 0 : Number(Number(sell).toFixed(1).toString().indexOf(".")) + 1;

    const pairData = {
      market: "KUCOIN",
      url: `https://www.kucoin.com/trade/${el.symbol}`,
      buyPrice: Number(sell),
      buyQty: null,
      sellPrice: Number(buy),
      sellQty: null,
      precision,
      fee: [],
    };

    if (!data[pair]) {
      data[pair] = [];
    }

    data[pair].push(pairData);
    return null;
  });
}

module.exports = {
  kucoinData,
  getPairOrders,
  getWithdrawFeesList,
};
