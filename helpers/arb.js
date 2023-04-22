const exclusions = [
  {
    market: "EXMO",
    pair: "GMT/USDT",
  },
  {
    market: "EXMO",
    pair: "PLCUC/USDT",
  },
  {
    market: "MEXC",
    pair: "GAS/USDT",
  },
  {
    market: "MEXC",
    pair: "MDT/USDT",
  },
  {
    market: "MEXC",
    pair: "GMT/USDT",
  },
  {
    market: "MEXC",
    pair: "QI/USDT",
  },
  {
    market: "MEXC",
    pair: "HERO/USDT",
  },
  {
    market: "MEXC",
    pair: "DFI/USDT",
  },
  {
    market: "BYBIT",
    pair: "MCT/USDT",
  },
  {
    market: "BYBIT",
    pair: "PLT/USDT",
  },
  {
    market: "BYBIT",
    pair: "BTC3S/USDT",
  },
  {
    market: "BYBIT",
    pair: "BTC3L/USDT",
  },
  {
    market: "BYBIT",
    pair: "ETH3S/USDT",
  },
  {
    market: "BYBIT",
    pair: "ETH3L/USDT",
  },
  {
    market: "BYBIT",
    pair: "XRP3L/USDT",
  },
  {
    market: "BYBIT",
    pair: "XRP3S/USDT",
  },
  {
    market: "BYBIT",
    pair: "DOT3L/USDT",
  },
  {
    market: "BYBIT",
    pair: "DOT3S/USDT",
  },
];

async function arbitrage(dataObj) {
  const pairsList = Object.keys(dataObj);
  exclusions.map(el =>
    dataObj[el.pair].splice(
      dataObj[el.pair].findIndex(obj => obj.market === el.market),
      1
    )
  );

  const arbData = pairsList.map(pair => {
    const minBuyPrice = dataObj[pair].sort((a, b) => a.buyPrice - b.buyPrice)[0];

    const maxSellPrice = dataObj[pair].sort((a, b) => b.sellPrice - a.sellPrice)[0];
    const fee = minBuyPrice.fee.length !== 0 ? minBuyPrice.fee[0][0] : 0;

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
