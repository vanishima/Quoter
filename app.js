let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let session = require("express-session");

let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let quotesRouter = require("./routes/quotes");
let booksRouter = require("./routes/books");
let authorsRouter = require("./routes/authors");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/quotes", quotesRouter);
app.use("/books", booksRouter);
app.use("/authors", authorsRouter);

app.use(
  session({
    secret: "2C44-4D44-WppQ38S",
    resave: true,
    saveUninitialized: true,
  })
);

module.exports = app;
