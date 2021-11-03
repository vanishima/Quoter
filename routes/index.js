var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // render the _index_ template with the title attribute as Express
  res.render("index", { title: "Express" });
});

module.exports = router;
