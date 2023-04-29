const express = require("express");
const { getArbitrage } = require("../../controllers/cryptos");
const { addPair } = require("../../controllers/exclusions");

const router = express.Router();

router.get("/", getArbitrage);

router.post("/:market/:symbol", addPair);

module.exports = router;
