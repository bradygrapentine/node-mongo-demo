const { MongoClient, ObjectId } = require("mongodb");

function circulationRepo() {
  const url = "mongodb://localhost:27017"; // local link
  const dbName = "circulation";

  function get(query, limit) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        let items = db.collection("newspapers").find(query);

        if (limit > 0) {
          items = items.limit(limit);
        }

        resolve(await items.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getByID(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db
          .collection("newspapers")
          .findOne({ _id: ObjectId(id) });
        resolve(results);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function add(item) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const addedItem = await db.collection("newspapers").insertOne(item);
        resolve(addedItem.ops[0]);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function update(id, newItem) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db
          .collection("newspapers")
          .findOneAndReplace({ _id: ObjectId(id) }, newItem, {
            returnOriginal: false,
          });
        resolve(results.value);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function remove(id) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db
          .collection("newspapers")
          .deleteOne({ _id: ObjectId(id) });

        resolve(results.deletedCount === 1);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function loadData(data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection("newspapers").insertMany(data);
        resolve(results);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function averageFinalists() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const avg = await db
          .collection("newspapers")
          .aggregate([{ $project: {} }])
          .toArray(); // here because of await
        resolve(avg[0].averageFinalists);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  function averageFinalistsByCirculationChange() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(url);
      try {
        await client.connect();
        const db = client.db(dbName);

        const avg = await db
          .collection("newspapers")
          .aggregate([{ $group: { _id: null, avgFinalists: { $avg } } }])
          .toArray(); // here because of await
        resolve(avg[0].averageFinalists);
        client.close();
      } catch (err) {
        reject(error);
      }
    });
  }

  return {
    loadData,
    get,
    getByID,
    update,
    remove,
    add,
    averageFinalists,
    averageFinalistsByCirculationChange,
  };
}

module.exports = circulationRepo();
