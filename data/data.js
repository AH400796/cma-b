const {
  exmoData,
  binanceData,
  mexcData,
  // bybitData
} = require("../services");

const { arbitrage } = require("../helpers");
const path = require("path");
const fs = require("fs").promises;
const arbPath = path.join(__dirname, "./arb.json");
const dataPath = path.join(__dirname, "./data.json");

const getData = async () => {
  const data = {};
  await exmoData(data);
  await binanceData(data);
  await mexcData(data);

  // await bybitData(data);

  const date = new Date(Date.now());
  const updateTime = date.toLocaleDateString() + " / " + date.toLocaleTimeString();

  const arb = await arbitrage(data);
  const sortData = arb.sort((a, b) => b[1] - a[1]);
  fs.writeFile(dataPath, JSON.stringify(data), "utf8");
  fs.writeFile(arbPath, JSON.stringify({ updateTime, sortData }), "utf8");
};

module.exports = getData;
