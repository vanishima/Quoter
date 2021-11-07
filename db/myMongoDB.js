/* ===================== Shushu Chen =================== */

const { MongoClient, ObjectId } = require("mongodb");

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

  // myDB.getQuotes = async (query = {}) => {
  //   const client = new MongoClient(uri, { useUnifiedTopology: true });
  //   console.log("Connecting to the db");

  //   try {
  //     await client.connect();
  //     console.log("Connected!");

  //     console.log(await listDatabases(client));

  //     const db = client.db(DB_NAME);
  //     const quotesCol = db.collection("quotes");
  //     console.log("Collection ready, querying with ", query);

  //     const quotes = await quotesCol.find(query).toArray();

  //     // console.log("Got quotes", quotes);

  //     return quotes;
  //   } finally {
  //     console.log("Closing the connection");
  //     client.close();
  //   }
  // };

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

      // const quotes = await quotesCol.find(query).toArray();
      const quotes = await quotesCol
        .aggregate([
          {
            $lookup: {
              from: "Authors",
              localField: "authorID",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $lookup: {
              from: "Books",
              localField: "bookID",
              foreignField: "_id",
              as: "book",
            },
          },
          { $match: query },
        ])
        .toArray();

      // console.log("Got quotes", quotes);

      return quotes;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.getObjectByText = async (collection, query) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const col = db.collection(collection);
      console.log("Collection ready, querying with ", query);

      let object = await col.findOne(query);

      if (object == null) {
        await myDB.insertDoc(collection, query);
        object = await col.findOne(query);
      }

      console.log("Got object", object);

      return object;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.searchQuotes = async (query = {}) => {
    const keyword = query.keyword;
    console.log("enter search quotes for", keyword);
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, querying with", keyword);

      const regex = RegExp(".*" + keyword + ".*");
      // find quotes that contain keyword case insensitive
      // const quotes = await quotesCol
      //   .find({
      //     $or: [
      //       { text: { $regex: regex, $options: "i" } },
      //       { tags: { $regex: regex, $options: "i" } },
      //       // { author: { $regex: regex, $options: "i" } },
      //       // { source: { $regex: regex, $options: "i" } },
      //     ],
      //   })
      //   .toArray();

      const quotes = await quotesCol
        .aggregate([
          {
            $lookup: {
              from: "Authors",
              localField: "authorID",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $lookup: {
              from: "Books",
              localField: "bookID",
              foreignField: "_id",
              as: "book",
            },
          },
          {
            $match: {
              $or: [
                { text: { $regex: regex, $options: "i" } },
                { tags: { $regex: regex, $options: "i" } },
                // { "author.name": { $regex: regex, $options: "i" } },
                // { "book.title": { $regex: regex, $options: "i" } },
              ],
            },
          },
        ])
        .toArray();

      // console.log("Got quotes", quotes);
      console.log(`Got ${quotes.length} results matching ${keyword}`);

      return quotes;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.getQuoteByID = async (quoteID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, querying with ", quoteID);

      // const quote = await quotesCol.findOne({ _id: ObjectId(quoteID) });

      const quote = await quotesCol
        .aggregate([
          {
            $lookup: {
              from: "Authors",
              localField: "authorID",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $lookup: {
              from: "Books",
              localField: "bookID",
              foreignField: "_id",
              as: "book",
            },
          },
          { $match: { _id: ObjectId(quoteID) } },
        ])
        .toArray();

      console.log("Got quote", quote);

      return quote[0];
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.createQuote = async (quote) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, insert ", quote);

      const res = await quotesCol.insertOne(quote);
      console.log("Inserted", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.insertDoc = async (collection, doc) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const col = db.collection(collection);
      console.log("Collection ready, insert ", doc);

      const res = await col.insertOne(doc);
      console.log("Inserted", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.updateQuoteByID = async (quote) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      const quotesCol = client.db(DB_NAME).collection("quotes");
      console.log("Collection ready, update ", quote);

      const res = await quotesCol.updateOne(
        { _id: ObjectId(quote._id) },
        {
          $set: {
            text: quote.text,
            tags: quote.tags,
            memo: quote.memo,
          },
        },
        { upsert: true }
      );
      console.log("Updated", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.deleteQuoteByID = async (quoteID) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, deleting ", quoteID);

      const quote = await quotesCol.deleteOne({ _id: ObjectId(quoteID) });

      console.log("Got quote", quote);

      return quote;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.getFullList = async (collection, query = {}) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const col = db.collection(collection);
      console.log(query);
      console.log(
        "Collection ready, querying with " + query + " in " + collection
      );

      const documents = await col.find(query).toArray();

      console.log("Got documents", documents);

      return documents;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.getObjectByID = async (collection, id) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      console.log(await listDatabases(client));

      const db = client.db(DB_NAME);
      const col = db.collection(collection);
      console.log(`Collection ready, querying ${id} in ${collection}`);

      const id_final = typeof id == ObjectId ? id : ObjectId(id);

      const object = await col.findOne({ _id: id_final });
      console.log("Got object", object);

      return object;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.likeQuoteByID = async (quoteID) => {
    console.log("likeQuoteByID", quoteID);

    const client = new MongoClient(uri, { useUnifiedTopology: true });
    console.log("Connecting to the db");

    try {
      await client.connect();
      console.log("Connected!");

      const db = client.db(DB_NAME);
      const quotesCol = db.collection("quotes");
      console.log("Collection ready, like ", quoteID);

      const filter = { _id: ObjectId(quoteID) };
      const options = { upsert: true };

      const updateDoc = {
        $inc: {
          likes: 1,
        },
      };

      const res = await quotesCol.updateOne(filter, updateDoc, options);
      console.log("updated", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}

module.exports = MyDB();
