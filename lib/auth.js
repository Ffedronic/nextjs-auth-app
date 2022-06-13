import { hash, compare } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export async function modifyPassword(client, collection, user, hashedPassword) {
  const db = client.db()
  const result = db.collection(collection).updateOne(user, {$set: { password: hashedPassword}})
  return result;
}
