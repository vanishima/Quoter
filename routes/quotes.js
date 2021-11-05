let express = require("express");
let router = express.Router();

const myDB = require("../db/myMongoDB.js");

/* GET FULL LIST */
router.get("/", async (req, res) => {
  const user = { username: "abc" };
  // res.json(quotesStub);
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes();
    // console.log(quotes);
    res.send({ quotes: quotes, user: user });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

// function filterTags(quotes, tag) {
//   /* Return true if any element in the quote matches tag */
//   let result = quotes.filter((quote) => {
//     return quote.text.includes(tag) || quote.tags.includes(tag);
//   });
//   /* || quotes.author.includes(tag) || quote.source.includes(tag)*/
//   return result;
// }

/* GET SEARCH RESULT */
router.get("/search/:keyword", async function (req, res) {
  console.log("enter search");
  let keyword = req.params.keyword;
  console.log("search for " + keyword);

  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.searchQuotes({ keyword: keyword });
    res.send({ quotes: quotes, keyword: keyword });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    // res.redirect("/");
  }
});

router.get("/:quoteID", async (req, res) => {
  const quoteID = req.params.quoteID;
  console.log("Enter /quotes/quoteID for", quoteID);
  const user = {username: "test"};
  try {
    console.log("MyDB", myDB);
    const quote = await myDB.getQuoteByID(quoteID);
    res.send({ quote: quote, user: user });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.get("/search", async function (req, res) {
  const keyword = req.query;
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.searchQuotes(keyword);
    // console.log(quotes);
    res.send({ quotes: quotes, keyword: keyword });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    res.redirect("/");
  }
});

/* GET A USER'S QUOTE */
// router.get("/users/:userID", async (req, res) => {
//   console.log("enter router /quotes")
//   const userID = req.params.userID;
//   try {
//     console.log("MyDB", myDB);
//     const quotes = await myDB.getQuotes({ userID: userID });
//     res.send(quotes);
//     // res.send({ quotes: quotes });
//   } catch (e) {
//     console.log("Error", e);
//     res.status(400).send({ err: e });
//   }
// });

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}

/* CREATE NEW QUOTE */
router.post("/create", async (req, res) => {
  const quote = req.body;

  /* Default values */
  quote.userID = "617e28bf60d195a63e74e9a6";
  quote.postDate = getDateTime();
  quote.privacy_level = 0;
  quote.collection = "temp";
  quote.likes = 0;
  quote.comments = [];

  console.log("create quote", quote);

  // insert quote into array
  try {
    const dbRes = await myDB.createQuote(quote);
    console.log("dbRes: ", dbRes);
    // res.send({ done: dbRes });
    res.redirect("/");
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* UPDATE current quote */
router.post("/update", async (req, res) => {
  const quote = req.body;

  console.log("enter /quotes/update quote", quote);

  // update quote
  try {
    const dbRes = await myDB.updateQuoteByID(quote);
    console.log("dbRes: ", dbRes);
    // res.send({ done: dbRes });
    res.json({status: "OK"});
    res.redirect("/");
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

function compare(a, b) {
  let d1 = new Date(a.postDate);
  let d2 = new Date(b.postDate);
  if (d1 < d2) {
    return 1;
  }
  if (d1 > d2) {
    return -1;
  }
  return 0;
}

/* Most Recent Quote */
router.get("/most-recent", async (req, res) => {
  const quotes = await myDB.getQuotes();
  let sortedQuotes = quotes.slice();
  console.log(sortedQuotes.sort(compare));
  res.json(sortedQuotes.sort(compare));
});

module.exports = router;
