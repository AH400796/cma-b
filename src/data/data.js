const path = require("path");
const fs = require("fs").promises;
const { exclCtrls } = require("../controllers");
const getArbitrage = require("./arb");
const arbPath = path.join(__dirname, "./arb.json");
const dataPath = path.join(__dirname, "./data.json");

const {
  exmoData,
  binanceData,
  mexcData,
  okxData,
  bybitData,
  // kucoinData,
} = require("../services");

const getData = async () => {
  const exclusions = (await exclCtrls.getExclusions()) || [];
  const data = {};
  await exmoData(data, exclusions);
  await binanceData(data, exclusions);
  await mexcData(data, exclusions);
  await okxData(data, exclusions);
  // await kucoinData(data, exclusions);
  await bybitData(data, exclusions);

  const date = Date.now();
  const arb = getArbitrage(data);
  const sortData = arb.filter(el => el !== null).sort((a, b) => b[1] - a[1]);
  fs.writeFile(dataPath, JSON.stringify(data), "utf8");
  fs.writeFile(arbPath, JSON.stringify({ date, sortData }), "utf8");
};

module.exports = getData;
