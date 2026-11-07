import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

let db;

const connectToDb = async () => {
  await client.connect();
  db = client.db(process.env.MONGODB_DB_NAME);
  console.log('Successfully connected to MongoDB Atlas');
};

const getDb = () => {
  if (!db) {
    throw new Error('Database is not connected');
  }

  return db;
};

export { connectToDb, getDb };