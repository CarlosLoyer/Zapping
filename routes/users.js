var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("user", {
      title: "Avestreaming",
      logo: "/images/ostrich_full_blanco.png",
      logo_xs: "/images/ostrich_logo_69x69.png",
      user: req.user.NOMBRE,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
