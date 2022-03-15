const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const circulationRepo = require("./repos/circulationRepo");
const data = require("./circulation.json");

const url = "mongodb://localhost:27017"; // local link
const dbName = "circulation";

async function main() {
  const client = new MongoClient(url);
  await client.connect();
  try {
    const results = await circulationRepo.loadData(data);
    console.log(results.insertedCount);
    assert.equal(data.length, results.insertedCount);
    const retrievedData = await circulationRepo.get();
    assert.equal(data.length, retrievedData.length);

    const filteredData = await circulationRepo.get({
      Newspaper: retrievedData[4].Newspaper,
    });

    assert.deepEqual(filteredData[0], retrievedData[4]);

    const limitData = await circulationRepo.get({}, 3);
    assert.equal(limitData.length, 3);
  } catch (error) {
    console.log(error);
  } finally {
    const admin = client.db(dbName).admin(); // object that lets us observe the server
    // console.log(await admin.serverStatus());
    console.log(await admin.listDatabases());

    await client.db(dbName).dropDatabase();
    client.close(); // must close connection
  }
}

main();
