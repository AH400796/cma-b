const axios = require("axios");
const path = require("path");
const fs = require("fs").promises;
const feesPath = path.join(__dirname, "./fees.json");
require("dotenv").config();
const crypto = require("crypto");

const {
  BinanceAPIKey,
  BinanceAPIsecret,
  OKXAPIKey,
  OKXAPISecret,
  OKXPassphrase,
  // ByBitAPIKey,
  // ByBitAPISecret
} = process.env;

const Binance = require("binance-api-node").default;

const client = Binance({
  apiKey: BinanceAPIKey,
  apiSecret: BinanceAPIsecret,
  getTime: Date.now,
});

// GET fee
const getWithdrawFeesList = async function () {
  const feesData = {};
  try {
    await getExmoFee(feesData);
    await getBinanceFee(feesData);
    await getOkxFee(feesData);
    await getMexcFee(feesData);
    // getBybitFee(feesData);
  } catch (error) {
    console.log(error.message);
  }

  fs.writeFile(feesPath, JSON.stringify(feesData), "utf8");
};

// MEXC
async function getMexcFee(feesData) {
  try {
    const result = await axios.get("https://www.mexc.com/open/api/v2/market/coin/list");
    feesData.mexc = [];

    result.data.data.forEach(el => {
      const symbol = el.currency;
      el.coins.forEach(el => {
        const amount = el.fee;
        const coin = symbol;
        const network = el.chain;
        const minWithValue = el.withdraw_limit_min;
        const fee = makeFee(amount, coin, network, minWithValue, symbol);
        feesData.mexc.push(fee);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}

// OKX
async function getOkxFee(feesData) {
  try {
    feesData.okx = [];
    const timestamp = new Date(Date.now()).toISOString();
    const string = timestamp + "GET" + `/api/v5/asset/currencies` + "";
    const sign = crypto.createHmac("sha256", OKXAPISecret).update(string).digest("base64");
    const config = {
      method: "GET",
      url: `https://www.okx.com/api/v5/asset/currencies`,
      headers: {
        "OK-ACCESS-KEY": OKXAPIKey,
        "OK-ACCESS-SIGN": sign,
        "OK-ACCESS-TIMESTAMP": timestamp,
        "OK-ACCESS-PASSPHRASE": OKXPassphrase,
      },
    };
    const result = await axios(config);
    result.data.data.forEach(el => {
      const amount = Number(el.minFee);
      const coin = el.ccy;
      const network = el.chain.includes("ERC20") ? "ERC20" : el.chain;
      const minWithValue = Number(el.minWd);
      const symbol = el.ccy;
      const fee = makeFee(amount, coin, network, minWithValue, symbol);
      feesData.okx.push(fee);
    });
  } catch (error) {
    console.log(error.message);
  }
}

// Bybit
// async function getBybitFee(feesData) {
//   try {
//     feesData.bybit = [];
//     const timestamp = Date.now().toString();
//     const sign = crypto
//       .createHmac("sha256", ByBitAPISecret)
//       .update(timestamp + ByBitAPIKey + "50000")
//       .digest("hex");

//     const config = {
//       method: "GET",
//       url: "https://api.bybit.com/v5/asset/coin/query-info",
//       headers: {
//         "X-BAPI-SIGN-TYPE": "2",
//         "X-BAPI-SIGN": sign,
//         "X-BAPI-API-KEY": ByBitAPIKey,
//         "X-BAPI-TIMESTAMP": timestamp,
//         "X-BAPI-RECV-WINDOW": "50000",
//         "Content-Type": "application/json; charset=utf-8",
//       },
//     };
//     const result = await axios(config);
//     console.log("data", result.data.result.rows);
//     result?.data?.result.rows.forEach(el => {
//       const coinName = el.name;
//       const symbolName = el.coin;
//       el.chains.forEach(el => {
//         const amount = Number(el.withdrawFee);
//         const coin = coinName;
//         const network = el.chainType;
//         const minWithValue = Number(el.withdrawMin);
//         const symbol = symbolName;
//         const fee = makeFee(amount, coin, network, minWithValue, symbol);

//         feesData.bybit.push(fee);
//       });
//     });
//   } catch (error) {
//     console.log(error.message);
//   }

// }

// Binance
async function getBinanceFee(feesData) {
  try {
    feesData.binance = [];
    const result = await client.capitalConfigs();
    result.forEach(el =>
      el.networkList.forEach(el => {
        if (Number(el.withdrawMin) === 0) {
          return;
        }
        const amount = Number(el.withdrawFee);
        const coin = el.coin;
        const network = el.name;
        const minWithValue = Number(el.withdrawMin);
        const symbol = el.coin;
        const fee = makeFee(amount, coin, network, minWithValue, symbol);
        feesData.binance.push(fee);
      })
    );
  } catch (error) {
    console.log(error.message);
  }
}
// EXMO
async function getExmoFee(feesData) {
  try {
    const result = await axios.get("https://api.exmo.com/v1.1/payments/providers/crypto/list");
    feesData.exmo = [];
    Object.keys(result.data).forEach(el =>
      result.data[el].forEach(el => {
        if (el.commission_desc.includes("%") || el.commission_desc === "") {
          return;
        }
        const amount = Number(el.commission_desc.replace(/[^\d.]/g, ""));
        const coin = el.commission_desc.replace(/[^a-zA-Z]/g, "");
        const network = el.comment.includes("ERC20") ? `${coin}(ERC20)` : `${coin}`;
        const minWithValue = parseFloat(el.min);
        const symbol = el.currency_name;
        const fee = makeFee(amount, coin, network, minWithValue, symbol);
        feesData.exmo.push(fee);
      })
    );
  } catch (error) {
    console.log(error.message);
  }
}

function makeFee(amount, coin, network, minWithValue, symbol) {
  const fee = {
    symbol,
    fee: [amount, coin, network, minWithValue],
  };
  return fee;
}

module.exports = getWithdrawFeesList;
