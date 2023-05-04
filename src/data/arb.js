function getArbitrageData(data) {
  const pairsList = Object.keys(data);
  const arbData = pairsList.map(pair => {
    const minBuyPrice = data[pair].sort((a, b) => a.buyPrice - b.buyPrice)[0];
    const maxSellPrice = data[pair].sort((a, b) => b.sellPrice - a.sellPrice)[0];
    const percentage = Number((((maxSellPrice.sellPrice - minBuyPrice.buyPrice) * 100) / minBuyPrice.buyPrice).toFixed(2));

    if (percentage <= 0) {
      return null;
    }
    return [pair, percentage, minBuyPrice, maxSellPrice];
  });
  return arbData;
}

module.exports = getArbitrageData;
