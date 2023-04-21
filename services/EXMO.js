const axios = require("axios");

const getPairsList = async function () {
  const result = await axios.get("https://api.exmo.com/v1.1/ticker");
  return result;
};

const getPairOrders = async function (pair) {
  const result = await axios.get(`https://api.exmo.com/v1.1/order_book?pair=${pair}&limit=1000`);
  return result;
};

const getWithdrawFeesList = async function () {
  const result = await axios.get("https://api.exmo.com/v1.1/payments/providers/crypto/list");
  return result;
};

async function exmoData(data) {
  const regEx = /_USDT/;
  const exmoPairList = await getPairsList();
  const exmoUSDTPairs = Object.keys(exmoPairList.data).filter(el => regEx.test(el));
  const orderBooks = await getPairOrders(exmoUSDTPairs.join(","));
  const fees = await getWithdrawFeesList();

  exmoUSDTPairs.map(el => {
    const pair = el.replace(/_/g, "/");
    const currency = el.replace(regEx, "");
    const { ask_top: askPrice, ask_quantity: askQty, bid_top: bidPrice, bid_quantity: bidQty } = orderBooks.data[el];
    const exmoFees = fees.data[currency]
      .filter(el => el.type === "withdraw")
      .map(el => {
        const feesArr = [parseFloat(el.commission_desc), el.commission_desc.replace(/[^a-zA-Z]/g, ""), parseFloat(el.min), el.name];
        return feesArr;
      });
    const precision = Number(askPrice) < 0.01 ? 0 : Number(Number(askPrice).toFixed(1).toString().indexOf(".")) + 1;

    const pairData = {
      market: "EXMO",
      url: `https://exmo.com/ru/trade/${el}`,
      buyPrice: Number(askPrice),
      buyQty: Number(Number(askQty).toFixed(precision)),
      sellPrice: Number(bidPrice),
      sellQty: Number(Number(bidQty).toFixed(precision)),
      fee: exmoFees,
    };
    if (!data[pair]) {
      data[pair] = [];
    }
    data[pair].push(pairData);

    return null;
  });
}

module.exports = exmoData;
