let express = require("express");
let router = express.Router();

const quotesStub = [
  {
    text: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    srcYear: 1889,
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
    srcYear: 1866,
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
    srcYear: 2017,
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

function filterTags(quotes, tag){
  let result = quotes.filter((quote) => {
    return quote.text.includes(tag) || quote.tags.includes(tag);
  });
  return result;
}

/* GET FILTERED LIST */
router.get("/search/:tag", function(req, res){
  let tag = req.params.tag;
  console.log("get tag " + tag);

  let quotes = filterTags(quotesStub, tag);

  res.json(quotes);
});

/* GET FULL LIST */
router.get("/search", (req, res) => {
  res.json(quotesStub);
});

/* CREATE NEW QUOTE */
router.post("/create", (req, res) => {
  const quote = req.body;
  console.log("create quote", quote.text);

  // insert quote into array
  quotesStub.push(quote);
  res.redirect("/");
});

module.exports = router;




