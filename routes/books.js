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
  await console.log("Got authorID", book.authorID);
  const author = await myDB.getObjectByID("Authors", book.authorID);

  console.log("Author gotten", author);
  console.log("Books by author", book);

  res.send({ author: author, book: book });
});

module.exports = router;