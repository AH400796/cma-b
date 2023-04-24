const express = require("express");
const { getArbitrage, addPair } = require("../../controllers/cryptos");

const router = express.Router();

router.get("/", getArbitrage);

router.post("/:market/:symbol", addPair);

module.exports = router;
