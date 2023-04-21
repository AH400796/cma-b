// const { Schema, model } = require("mongoose");

// const cryptoPairsSchema = new Schema({ marketplace: String });

const fs = require("fs").promises;
const path = require("path");

const cryptoPath = path.join(__dirname, "cryptoPairs.json");

const getCryptoPairs = async () => {
  const data = await fs.readFile(cryptoPath, "utf-8");
  return JSON.parse(data);
};

const getCryptoPairById = async id => {
  const cryptoPairs = await getCryptoPairs();
  const cryptoPair = cryptoPairs.find(pair => pair.id === id);
  return cryptoPair ?? null;
};

// const addCryptoPair =

module.exports = {
  getCryptoPairs,
  getCryptoPairById,
};
