const express = require("express");
const { authCtrls } = require("../../controllers");
const { userJoiSchema } = require("../../models");
const { validateBody, authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/register", validateBody(userJoiSchema), authCtrls.register);
router.post("/verify", authCtrls.verify);
router.post("/reverify", authCtrls.reverify);
router.post("/login", validateBody(userJoiSchema), authCtrls.login);
router.post("/logout", authenticate, authCtrls.logout);
router.get("/currentUser", authenticate, authCtrls.getCurrent);

module.exports = router;
