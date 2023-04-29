const { ctrlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs").promises;

const arbPath = path.join(__dirname, "../data/arb.json");
const exlusPath = path.join(__dirname, "../exclusions/exclusions.json");

const getArbitrage = async (req, res, next) => {
  const result = await fs.readFile(arbPath, "utf8");
  const data = JSON.parse(result);
  res.status(200).json(data);
};

const addPair = async (req, res, next) => {
  const { market, symbol } = req.params;
  const pair = symbol + "/USDT";
  const result = await fs.readFile(exlusPath, "utf8");
  const exlusPairs = JSON.parse(result);
  if (!exlusPairs[market]) {
    exlusPairs[market] = [];
  }
  if (exlusPairs[market].includes(pair)) {
    return;
  }
  exlusPairs[market].push(pair);
  fs.writeFile(exlusPath, JSON.stringify(exlusPairs, null, 2), "utf8");
  res.status(201).json(pair);
};

module.exports = {
  getArbitrage: ctrlWrapper(getArbitrage),
  addPair: ctrlWrapper(addPair),
};
