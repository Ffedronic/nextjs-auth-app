import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ygtml.mongodb.net/?retryWrites=true&w=majority`
  );
  return client;
}

export async function insertNewUser(client, collection, user) {
  const db = await client.db();
  const result = await db.collection(collection).insertOne(user);
  return result;
}
