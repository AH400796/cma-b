// const { getPairOrders, getWithdrawFeesList } = require("../services");

function arbitrage(data) {
  const pairsList = Object.keys(data);

  const arbData = pairsList.map(pair => {
    // const pairToFetch = pair.replace(/\//g, "-");

    const minBuyPrice = data[pair].sort((a, b) => a.buyPrice - b.buyPrice)[0];

    const maxSellPrice = data[pair].sort((a, b) => b.sellPrice - a.sellPrice)[0];

    const percentage = Number((((maxSellPrice.sellPrice - minBuyPrice.buyPrice) * 100) / minBuyPrice.buyPrice).toFixed(2));

    if (percentage <= 0) {
      return null;
    }

    // if (minBuyPrice.market !== "KUCOIN" || maxSellPrice.market !== "KUCOIN") {
    //   return [pair, percentage, minBuyPrice, maxSellPrice];
    // }
    // const result = await getPairOrders(pairToFetch);
    // console.log(result);
    // if (minBuyPrice.market === "KUCOIN") {
    //   // console.log(result);
    //   minBuyPrice.buyQty = result.bestBidSize;
    //   minBuyPrice.sellQty = result.bestAskSize;
    // }
    // if (maxSellPrice.market === "KUCOIN") {
    //   maxSellPrice.buyQty = result.bestBidSize;
    //   maxSellPrice.sellQty = result.bestAskSize;
    // }

    // console.log([pair, percentage, minBuyPrice, maxSellPrice]);
    return [pair, percentage, minBuyPrice, maxSellPrice];
  });

  return arbData;
}

module.exports = arbitrage;
