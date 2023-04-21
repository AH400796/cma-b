const express = require("express");
const { getArbitrage } = require("../../controllers/cryptos");

const router = express.Router();

router.get("/", getArbitrage);

module.exports = router;
