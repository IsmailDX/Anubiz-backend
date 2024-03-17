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
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3001/",
    successRedirect: "http://localhost:3001/home",
  })
);

// logout google
router.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("http://localhost:3001/");
  });
});

//reset password
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

module.exports = router;
