// const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases: ");

  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

function MyDB() {
  const myDB = {};
  const uri =
    "mongodb+srv://vanishima:testtest@quoter.1muqt.mongodb.net/quoter?retryWrites=true&w=majority";
  const DB_NAME = "quoter";

  myDB.createUser = async (user) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      const db = client.db(DB_NAME);
      const userCol = db.collection("users");
      console.log("Collection ready, insert ", user);

      const res = await userCol.insertOne(user);

      console.log("Inserted", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}


module.exports = MyDB();
