import { MongoClient } from "mongodb";

/**
 * It connects to the MongoDB Atlas cluster using the username and password stored in the environment
 * variables
 * @returns The client object.
 */
export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.ygtml.mongodb.net/?retryWrites=true&w=majority`
  );
  return client;
}

/**
 * It takes a client, a collection, and a user object, and then inserts the user object into the
 * collection
 * @param client - The client object that you created in the previous step.
 * @param collection - The name of the collection you want to insert the user into.
 * @param user - the user object to be inserted
 * @returns The result of the insertOne() method.
 */
export async function insertNewUser(client, collection, user) {
  const db = await client.db();
  const result = await db.collection(collection).insertOne(user);
  return result;
}

/**
 * This function will return a promise that will resolve to a user object if the user exists in the
 * database, or null if the user does not exist.
 * @param client - The client object that you get from the MongoClient.connect() function.
 * @param collection - the name of the collection in the database
 * @param user - {
 * @returns The result of the findOne() method.
 */
export async function isExistingUser(client, collection, user) {
  const db = await client.db();
  const result = await db.collection(collection).findOne(user);
  return result;
}
