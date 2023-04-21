const { ctrlWrapper } = require("../helpers");
const path = require("path");
const fs = require("fs").promises;

const arbPath = path.join(__dirname, "../data/arb.json");

const getArbitrage = async (req, res, next) => {
  const result = await fs.readFile(arbPath, "utf8");
  const data = JSON.parse(result);
  res.status(200).json(data);
};

module.exports = {
  getArbitrage: ctrlWrapper(getArbitrage),
};
