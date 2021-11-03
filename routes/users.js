var express = require("express");
var router = express.Router();

const myDB = require("../db/myMongoDBUser.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("user", { title: "User", userID: "" });
});

/* GET A USER'S QUOTE */
router.get("/:userID", async (req, res) => {
  console.log("enter router /quotes");
  const userID = req.params.userID;
  try {
    console.log("MyDB", myDB);
    const quotes = await myDB.getQuotes({ userID: userID });
    res.send(quotes);
    // res.send({ quotes: quotes });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* POST register user */
router.post("/register", async function (req, res) {
  console.log("enter POST register account");
  const resUser = req.body;
  const user = {
    name: resUser.name,
    password: resUser.password
  };

  try {
    const dbRes = await myDB.createUser(user);
    console.log("dbRes", dbRes);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    req.session.message = user.username;
    res.redirect("/");
  }
  
  // res.send("respond with a resource");
});

/* GET login user */
router.get("/login", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/hehe", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
