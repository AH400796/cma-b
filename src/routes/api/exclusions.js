const express = require("express");
const { exclCtrls } = require("../../controllers");

const router = express.Router();

router.post("/:market/:symbol", exclCtrls.addExclPair);

module.exports = router;
