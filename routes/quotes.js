let express = require("express");
let router = express.Router();

const quotesStub = [
  {
    text: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    userID: "1",
    privacy_level: "0",
    collection: "",
  },
];

/* GET home page */
router.get("/", (req, res) => {
  res.json(quotesStub);
});

module.exports = router;