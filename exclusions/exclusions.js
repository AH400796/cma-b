const path = require("path");
const fs = require("fs").promises;

const exlusPath = path.join(__dirname, "./exclusions.json");

const getExclusions = async () => {
  const result = await fs.readFile(exlusPath, "utf8");
  const data = JSON.parse(result);
  return data;
};

module.exports = getExclusions;

// {
//   "EXMO": ["GMT/USDT", "PLCUC/USDT"],
//   "MEXC": ["DFI/USDT", "GAS/USDT", "MDT/USDT", "GMT/USDT", "QI/USDT", "HERO/USDT"],
//   "BYBIT": ["DOT3S/USDT", "DOT3L/USDT", "XRP3S/USDT", "XRP3L/USDT", "ETH3L/USDT", "ETH3S/USDT", "BTC3L/USDT", "BTC3S/USDT", "PLT/USDT", "MCT/USDT"],
//   "BINANCE": []
// }
