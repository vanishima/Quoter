let express = require("express");
let router = express.Router();

const quotesStub = [
  {
    text: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    srcDate: 1889,
    userID: "1",
    postDate: "2021-10-28 10:30:01",
    privacy_level: "0",
    collection: "",
  },
  {
    text: "To go wrong in one's own way is better than to go right in someone else's.",
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    srcDate:1866,
    userID: "1",
    postDate: "2021-10-28 10:50:01",
    privacy_level: "0",
    collection: "",
  },
  {
    text: "To say we know a person is to write that person off.",
    author: "Yiyun Li",
    source: "Dear Friend, from My Life I Write to You in Your Life",
    srcDate: 2017,
    userID: "1",
    postDate: "2021-10-28 13:30:01",
    privacy_level: "0",
    collection: "",
  }
];

/* GET home page */
router.get("/", (req, res) => {
  res.json(quotesStub);
});

router.get("/search", (req, res) => {
  const tag = req.body;
  console.log("search " + tag);
});

module.exports = router;




