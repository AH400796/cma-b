async function arbitrage(dataObj) {
  const pairsList = Object.keys(dataObj);

  const arbData = pairsList.map(pair => {
    const minBuyPrice = dataObj[pair].sort((a, b) => a.buyPrice - b.buyPrice)[0];

    const maxSellPrice = dataObj[pair].sort((a, b) => b.sellPrice - a.sellPrice)[0];
    const fee = minBuyPrice.fee.length !== 0 ? minBuyPrice.fee[0][0] : 0;

    const percentage = Number(
      (
        ((maxSellPrice.sellPrice * minBuyPrice.buyQty - minBuyPrice.buyPrice * minBuyPrice.buyQty - minBuyPrice.buyPrice * fee) * 100) /
        (minBuyPrice.buyPrice * minBuyPrice.buyQty)
      ).toFixed(2)
    );
    return [pair, percentage, minBuyPrice, maxSellPrice];
  });

  // const arbData = pairsList.map(pair => {
  //   const minBuyPrice = dataObj[pair].reduce((prev, current) => {
  //     return prev.buyPrice < current.buyPrice ? prev : current;
  //   });
  //   const maxSellPrice = dataObj[pair].reduce((prev, current) => {
  //     return prev.sellPrice > current.buyPrice ? prev : current;
  //   });

  //   const fee = minBuyPrice.fee.length !== 0 ? minBuyPrice.fee[0][0] : 0;

  //   const percentage = Number(
  //     (
  //       ((maxSellPrice.sellPrice * minBuyPrice.buyQty - minBuyPrice.buyPrice * minBuyPrice.buyQty - minBuyPrice.buyPrice * fee) * 100) /
  //       (minBuyPrice.buyPrice * minBuyPrice.buyQty)
  //     ).toFixed(2)
  //   );
  //   return [pair, percentage, minBuyPrice, maxSellPrice];
  // });
  return arbData;
}

module.exports = arbitrage;
