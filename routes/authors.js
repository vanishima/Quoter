/* ===================== Shushu Chen =================== */

let express = require("express");
let router = express.Router();
const { ObjectId } = require("mongodb");

const myDB = require("../db/myMongoDB.js");
const user = { username: "abc" };

/* GET Author list */
router.get("/", async function (req, res) {
  console.log("Got request for /authors");
  const authors = await myDB.getFullList("Authors", {});
  console.log("got authors", authors);
  res.send({ authors: authors, user: user });
});

/* GET Author Details */
router.get("/:authorID", async function (req, res) {
  const authorID = req.params.authorID;
  console.log("Enter author details with", authorID);

  const author = await myDB.getObjectByID("Authors", authorID);
  const books = await myDB.getFullList("Books", {
    authorID: ObjectId(authorID),
  });

  // console.log("Author gotten", author);
  // console.log("Books by author", books);

  res.send({ author: author, books: books });
});

module.exports = router;
