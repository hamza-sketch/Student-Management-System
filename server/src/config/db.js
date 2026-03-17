require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let _db;

async function connectToMongo() {
  try {
    await client.connect();
    _db = client.db("myDatabase"); // your DB name
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop app if DB fails
  }
}

function getDb() {
  if (!_db) {
    throw new Error("❌ Database not connected. Call connectToMongo() first.");
  }
  return _db;
}

module.exports = { connectToMongo, getDb };