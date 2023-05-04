const express = require("express");
const { exclCtrls, arbitrageCtrls } = require("../../controllers");

const router = express.Router();

router.get("/", arbitrageCtrls.getArbitrage);

router.post("/:market/:symbol", exclCtrls.addExclPair);

module.exports = router;
