/* ===================== Shushu Chen =================== */

let express = require("express");
let router = express.Router();

const myDB = require("../db/myMongoDB.js");
const { ObjectId } = require("mongodb");

/* GET FULL LIST */
router.get("/", async (req, res) => {
  // res.json(quotesStub);
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes();
    // console.log(quotes);
    res.send({ quotes: quotes, currTime: getTimeStr() });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* GET FULL LIST by user */
router.get("/user/:userID", async (req, res) => {
  const userID = req.params.userID;

  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes({ userID: userID });
    // console.log(quotes);
    res.send({ quotes: quotes, currTime: getTimeStr() });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* CREATE NEW QUOTE */
router.post("/create", async (req, res) => {
  const quote = req.body;

  /* Default values */
  if (quote.userID == null) {
    quote.userID = ObjectId("617e28bf60d195a63e74e9a6");
  }

  // Create New Author or Get existing authorID
  let author;
  if (quote.authorID == null) {
    if (quote.author != null) {
      author = await myDB.getObjectByText("Authors", { name: quote.author });
    }
    quote.authorID = ObjectId(author._id);
  } else {
    quote.authorID = ObjectId(quote.authorID);
  }

  // Create New Book or Get existing bookID
  let book;
  if (quote.bookID == null) {
    if (quote.source != null) {
      book = await myDB.getObjectByText("Books", {
        title: quote.source,
        year: quote.srcYear,
        authorID: quote.authorID,
      });
    }
    quote.bookID = ObjectId(book._id);
  } else {
    quote.bookID = ObjectId(quote.bookID);
  }

  quote.postDate =
    quote.postDate != null
      ? new Date(quote.postDate + ":01.000Z")
      : getDateTime();
  quote.likes = 0;

  const tagStr = quote.tags;
  quote.tags = tagStr.split(" ");
  // quote.tags = quote.tags.split(" ");

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

/* POST UPDATE current quote */
router.post("/update", async (req, res) => {
  const quote = req.body;
  const tagStr = quote.tags;
  quote.tags = tagStr.split(" ");

  console.log("enter /quotes/update quote", quote);

  // update quote
  try {
    const dbRes = await myDB.updateQuoteByID(quote);
    console.log("dbRes: ", dbRes);
    res.json({ status: "OK" });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* POST DELETE current quote */
router.post("/delete", async (req, res) => {
  const quote = req.body;

  console.log("enter /quotes/delete quote", quote);

  // update quote
  try {
    const dbRes = await myDB.deleteQuoteByID(quote._id);
    console.log("dbRes: ", dbRes);
    // res.send({ done: dbRes });
    res.json({ status: "OK" });
    // res.redirect(`../quoteDetails.html?quoteID=${quote._id}`);
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
    res.send({ quotes: quotes, keyword: keyword, currTime: getTimeStr() });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    // res.redirect("/");
  }
});

router.post("/like/:quoteID", async (req, res) => {
  const quoteID = req.params.quoteID;
  console.log("Enter /quotes/like/quoteID for", quoteID);
  try {
    console.log("MyDB", myDB);
    const dbRes = await myDB.likeQuoteByID(quoteID);
    // res.send({ quote: quote});
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    res.redirect("/");
  }
});

router.get("/:quoteID", async (req, res) => {
  const quoteID = req.params.quoteID;
  console.log("Enter /quotes/quoteID for", quoteID);
  const user = { username: "test" };
  try {
    console.log("MyDB", myDB);
    const quote = await myDB.getQuoteByID(quoteID);
    quote.author = quote.author[0];
    quote.book = quote.book[0];
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
    console.log(quotes);
    res.send({ quotes: quotes, keyword: keyword, currTime: getTimeStr() });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    res.redirect("/");
  }
});

/* GET A USER'S QUOTE */
router.get("/users/:userID", async (req, res) => {
  console.log("enter router /quotes");
  const userID = req.params.userID;
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes({ userID: userID });
    res.send(quotes);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date + " " + time;
}

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

function getTimeStr() {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return localISOTime.substring(0, 16);
}

module.exports = router;
