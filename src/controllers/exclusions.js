const { ctrlWrapper, HttpError } = require("../helpers");
const { Exclusion } = require("../models");

const getExclusions = async () => {
  try {
    const result = await Exclusion.find({}, "-createdAt -updatedAt");
    return result;
  } catch (error) {
    HttpError(400);
  }
};

const addExclPair = async (req, res, next) => {
  const { market, symbol } = req.params;
  const pair = symbol + "/USDT";
  const data = await Exclusion.find({}, "-createdAt -updatedAt");
  if (data.find(el => el.market === market && el.pair === pair)) {
    return res.status(409).json({ message: `The ${pair} is already in the exclusion list of ${market}` });
  }
  const result = await Exclusion.create({ market, pair });
  res.status(201).json(result);
};

module.exports = {
  getExclusions,
  addExclPair: ctrlWrapper(addExclPair),
};
