let express = require("express");
let router = express.Router();

const myDB = require("../db/myMongoDB.js");

const quotesStub = [
  {
    text: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    srcYear: 1889,
    userID: "1",
    postDate: "2021-10-28 10:30:01",
    privacy_level: "0",
    likes: 103,
    collection: "",
    tags: "tag1 tag2 tag3",
    comments: [
      {
        text: "i like it!!!",
        userID: "1",
        datetime: "2021-10-28 10:30:31",
      },
      {
        text: "i like it too!!!",
        userID: "2",
        datetime: "2021-10-28 10:50:31",
      },
    ],
  },
  {
    text: "To go wrong in one's own way is better than to go right in someone else's.",
    author: "Fyodor Dostoevsky",
    source: "Crime and Punishment",
    srcYear: 1866,
    userID: "1",
    postDate: "2021-10-28 10:50:01",
    privacy_level: "0",
    likes: 13,
    collection: "",
    tags: "tag2",
    comments: [
      {
        text: "i like it!!!",
        userID: "1",
        datetime: "2021-10-28 10:30:31",
      },
      {
        text: "i like it too!!!",
        userID: "2",
        datetime: "2021-10-28 10:50:31",
      },
    ],
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
    tags: "tag3",
    comments: [
      {
        text: "i like it!!!",
        userID: "1",
        datetime: "2021-10-28 10:30:31",
      },
      {
        text: "i like it too!!!",
        userID: "2",
        datetime: "2021-10-28 10:50:31",
      },
    ],
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
    tags: "tag3",
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
    tags: "tag3",
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
    tags: "tag3",
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
    tags: "tag3",
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
    tags: "tag3",
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
    tags: "tag3",
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
    tags: "tag3",
  },
];

/* GET FULL LIST */
router.get("/", async (req, res) => {
  // res.json(quotesStub);
  // res.send({quotes: quotesStub});
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes();
    // console.log(quotes);
    res.send(quotes);
    // res.send({ quotes: quotes });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

function filterTags(quotes, tag) {
  /* Return true if any element in the quote matches tag */
  let result = quotes.filter((quote) => {
    return quote.text.includes(tag) || quote.tags.includes(tag);
  });
  /* || quotes.author.includes(tag) || quote.source.includes(tag)*/
  return result;
}

/* GET FILTERED LIST */
router.get("/search/:tag", async function (req, res) {
  let keyword = req.params.tag;
  console.log("search for " + keyword);

  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.searchQuotes(keyword);
    res.send(quotes);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* GET FULL LIST */
// router.get("/search", (req, res) => {
//   console.log("search empty");
//   res.send({ quotes: quotesStub });
//   // res.json(quotesStub);
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
  // quotesStub.push(quote);
  try {
    const dbRes = await myDB.createQuote(quote);
    console.log("dbRes: ", dbRes);
    // res.send({ done: dbRes });
    res.redirect("/");
  } catch(e) {
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
router.get("/most-recent", (req, res) => {
  let sortedQuotes = quotesStub.slice();
  console.log(sortedQuotes.sort(compare));
  res.json(sortedQuotes.sort(compare));
});

module.exports = router;