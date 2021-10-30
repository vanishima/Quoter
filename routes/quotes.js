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
    tags: "tag1 tag2 tag3"
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
    tags: "tag2"
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
    tags: "tag3"
  }
];

/* GET FULL LIST */
router.get("/", (req, res) => {
  res.json(quotesStub);
});

/* GET FILTERED LIST */
router.get("/search/:tag", function(req, res){
  console.log("get tag " + tag);
  res.json(quotesStub);
  // const result = quotesStub.filter((quote) => {
  //   return quote.text.contains(tag) || quote.tags.contains(tag);
  // });
  // const filteredList = quotesStub.filter(quote => quote.text.contains(tag) || quote.tags.contains(tag));
  // res.json(result);
});


router.get("/search", (req, res) => {
  const tag = req.body;
  console.log("search " + tag);
  res.json(quotesStub);
});

module.exports = router;




