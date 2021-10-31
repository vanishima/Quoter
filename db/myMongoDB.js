// const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

function MyDB() {
  const myDB = {};
  const url =
    "mongodb+srv://vanishima:testtest@quoter.1muqt.mongodb.net"; // /Quoter?retryWrites=true&w=majority
  const DB_NAME = "Quoter";

  myDB.getQuotes = async (query = {}) => {
    let client;

    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");

      await client.connect();
      console.log("Connected!");

      const db = client.db(DB_NAME);

      const quotesCol = db.collection("quotes");
      console.log("Collection ready, querying with ", query);

      const quotes = await quotesCol.find(query).toArray;
      console.log("Got quotes", quotes);

      return quotes;

    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}


async function insertQuote(quote) {
  const db = await MyMongoDB();

  const stmt = await db.prepare(`INSERT INTO
        quotes(text, author, source, srcYear, userID, privacy_level, likes)
        VALUES(@text, @author, @source, @srcYear, @userID, @privacy_level, @likes);
        `);

  try {
    return await stmt.run({
      "@text": quote.text,
      "@author": quote.author,
      "@source": quote.source,
      "@srcYear": quote.srcYear,
      "@userID": quote.userID,
      "@privacy_level": quote.privacy_level,
      "@likes": quote.likes,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

module.exports = MyDB();
