const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

router.route("/api/v1/register").post(register);
router.route("/api/v1/login").post(login);
router.route("/api/v1/verify/:token").get(verify);

//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

//reset password
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
