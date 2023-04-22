async function arbitrage(data) {
  const pairsList = Object.keys(data);

  const arbData = pairsList.map(pair => {
    const minBuyPrice = data[pair].sort((a, b) => a.buyPrice - b.buyPrice)[0];

    const maxSellPrice = data[pair].sort((a, b) => b.sellPrice - a.sellPrice)[0];

    const fee = minBuyPrice && minBuyPrice.fee.length !== 0 ? minBuyPrice.fee[0][0] : 0;

    const percentage = Number(
      (
        ((maxSellPrice.sellPrice * (minBuyPrice.buyQty - fee) - minBuyPrice.buyPrice * minBuyPrice.buyQty) * 100) /
        (minBuyPrice.buyPrice * minBuyPrice.buyQty)
      ).toFixed(2)
    );
    return [pair, percentage, minBuyPrice, maxSellPrice];
  });

  return arbData;
}

module.exports = arbitrage;
