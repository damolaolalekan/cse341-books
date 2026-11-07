
import { MongoClient } from 'mongodb';

let database;
let client;

const connectToDb = async () => {
    const connectionString = process.env.MONGODB_URI;

    if (!connectionString) {
        throw new Error('MONGODB_URI is required.');
    }

    client = new MongoClient(connectionString);

    await client.connect();

    database = client.db(
        process.env.MONGODB_DB_NAME || 'practice'
    );

    console.log('Successfully connected to MongoDB Atlas');

    return database;
};

const getDb = () => {
    if (!database) {
        throw new Error(
            'Database not initialized. Call connectToDb first.'
        );
    }

    return database;
};

export { connectToDb, getDb };
