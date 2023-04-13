var express = require("express");
var router = express.Router();
const passport = require("passport");
const User = require("../models/user_model");

router.get(["/login", "/"], (req, res) => {
  console.log(req.session);
  if (req.isAuthenticated()) {
    res.redirect("/users");
  } else if (req.flash("error").length > 0) {
    res.render("login", {
      title: "Avestreaming",
      err: true,
      msg: "Usuario y/o contraseña incorrectos",
      col: 'style="color: rgba(255, 0, 0, 0.678)"',
    });
  } else {
    res.render("login", {
      title: "Avestreaming",
      err: false,
      msg: "",
      col: "",
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/users",
    failureRedirect: "/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Avestreaming - Registrate!",
    err: false,
    msg: "",
    col: "",
  });
});

router.post("/register", (req, res) => {
  User.registerUser([
    req.body.regName,
    req.body.regEmail,
    req.body.regPass,
  ]).then((result) => {
    res.render("register", {
      title: "Avestreaming - Registrate!",
      err: result.err,
      msg: result.msg,
      col: result.err
        ? 'style="color: rgba(255, 0, 0, 0.678)"'
        : 'style="color: rgba(0, 255, 34, 0.678)"',
    });
  });
});

router.get("/logout", async function (req, res, next) {
  req.session.destroy(function (err) {});
  res.redirect("/");
});

router.get("/hls/zapping.m3u8", (req, res) => {
  const file = "./public/files/zapping.m3u8";
  res.download(file);
});

module.exports = router;
