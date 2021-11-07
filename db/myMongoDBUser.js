// const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const { secret } = require("./secrets/dbCon.js");

async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases: ");

  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

function MyDB() {
  const myDB = {};
  const uri = secret.uri;
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
      if (res){
        console.log("Inserted", res);
        return res;
      }
      else {
        console.log("already exist");
        return null;
      }
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.loginUser = async (user) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      const db = client.db(DB_NAME);
      const userCol = db.collection("users");
      console.log("Collection ready, find ", user);

      const res = await userCol.findOne(user);
      if(res){
        console.log("Found", res);

        return res;
      }
      else {
        console.log("not found");
        return null;
      }
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}


module.exports = MyDB();