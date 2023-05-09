const { exclCtrls } = require("../controllers");
const getArbitrage = require("./arb");

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

  return { date, sortData };
};

module.exports = getData;
