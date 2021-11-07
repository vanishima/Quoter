/* ===================== Shushu Chen =================== */

let express = require("express");
let router = express.Router();
const { ObjectId } = require("mongodb");
const user = { username: "abc" };

const myDB = require("../db/myMongoDB.js");

/* GET Author list */
router.get("/", async function (req, res) {
  console.log("Got request for /authors");
  const books = await myDB.getFullList("Books", {});
  console.log("got books", books);
  res.send({ books: books, user: user });
});

/* GET Book Details */
router.get("/:bookID", async function (req, res) {
  const bookID = req.params.bookID;
  console.log("Enter books details with", bookID);

  const book = await myDB.getObjectByID("Books", bookID);
  const quotes = await myDB.getFullList("quotes", { bookID: ObjectId(bookID) });
  await console.log("Got authorID", book.authorID);
  const author = await myDB.getObjectByID("Authors", book.authorID);
  const currTime = getTimeStr();

  console.log("Author gotten", author);
  console.log("Books by author", book);
  console.log("Books by quotes", quotes);

  res.send({ author: author, book: book, currTime: currTime, quotes: quotes });
});

function getTimeStr() {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1);
  // return localISOTime;
  return localISOTime.substring(0, 16);
}

module.exports = router;
