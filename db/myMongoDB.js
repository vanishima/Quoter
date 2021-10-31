// const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

async function listDatabases(client){
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases: ");

  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


function MyDB() {
  const myDB = {};
  const uri =
    "mongodb+srv://vanishima:testtest@quoter.1muqt.mongodb.net/quoter?retryWrites=true&w=majority"; 
  const DB_NAME = "quoter";

  myDB.getQuotes = async (query = {}) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, querying with ", query);

      // quotesCol.find().toArray(function(err, items){
      //   // if (err) throw err;
      //   // console.log("items", items);
      // });

      const quotes = await quotesCol.find(query).toArray();

      // console.log("Got quotes", quotes);

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
