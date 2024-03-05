const express = require("express");
const router = express.Router();

const { register, login, verify } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify/:token").get(verify);

module.exports = router;
