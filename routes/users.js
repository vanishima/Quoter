/* ===================== Zhengyuan Chen, Shushu Chen =================== */

let express = require("express");
let router = express.Router();

const myDB = require("../db/myMongoDBUser.js");
const quotesDB = require("../db/myMongoDB.js");
const { ObjectId } = require("mongodb");

let currentUser = null;
let loginStatus = false;
let uid = null;

/* GET users listing. */
router.get("/", function (req, res) {
  res.send({
    title: "User",
    userID: uid,
    username: currentUser,
    status: loginStatus,
  });
});

/* GET A USER'S QUOTE */
router.get("/:userID", async (req, res) => {
  console.log("enter router /user/userID");
  const userID = req.params.userID;
  try {
    console.log("MyDB", myDB);
    const quotes = await quotesDB.getQuotes({ userID: userID });
    res.send(quotes);
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
    password: resUser.password,
  };
  try {
    const dbRes = await myDB.createUser(user);
    console.log("dbRes", dbRes);
    if (dbRes === null) {
      res.send("User already exist");
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/* GET login user */
router.post("/login", async function (req, res) {
  console.log("enter POST user login");
  const resUser = req.body;
  const user = {
    name: resUser.name,
    password: resUser.password,
  };
  try {
    const dbRes = await myDB.loginUser(user);
    console.log("dbRes", dbRes);
    if (dbRes === null) {
      res.send("Incorrect username/password");
      //res.redirect("/");
    } else {
      // uid = new ObjectId(dbRes._id);
      // console.log("uid", uid);
      // currentUser = user.name;
      // loginStatus = true;
      res.json({ status: "OK", user: dbRes });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  } finally {
    // res.redirect("/");
  }
});

router.post("/logout", (req, res) => {
  console.log("enter post for logout");
  // req.session.destroy();
  sessionStorage.clear();

  // res.send({title: "User logout", userID: "", username: currentUser});
  currentUser = null;
  loginStatus = false;
  uid = null;
  res.redirect("/");
});

module.exports = router;
