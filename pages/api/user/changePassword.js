import { getSession } from "next-auth/react";
import { connectToDatabase, isExistingUser } from "../../../lib/db";
import {
  verifyPassword,
  hashPassword,
  modifyPassword,
} from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return;
  }
  
  const data = req.body;

  /* Destructuring the data object. */
  const { oldPassword, newPassword } = data;

  /* Getting the session from the request. */
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "not authenticated!" });
  }

  /* Getting the email from the session. */
  const userEmail = session.user.email;

  /* Connecting to the database. */
  const client = await connectToDatabase();

  /* Checking if the user exists in the database. */
  const user = await isExistingUser(client, "users", { email: userEmail });

  if (!user) {
    client.close();
    res.status(422).json({ message: "user not found!" });
    return;
  }

  /* Getting the password from the database. */
  const hashedUserPassword = user.password;

  /* Comparing the old password with the hashed password in the database. */
  const areEqual = await verifyPassword(oldPassword, hashedUserPassword);

  if (!areEqual) {
    client.close();
    res.status(422).json({ message: "invalid password" });
    return;
  }

  /* Hashing the new password. */
  const hashedNewPassword = await hashPassword(newPassword);

  /* Updating the password in the database. */
  const result = await modifyPassword(
    client,
    "users",
    { email: userEmail },
    hashedNewPassword
  );

  if (!result) {
    client.close();
    res.status(500).json({ message: "error server!" });
    return;
  }

  client.close();

  res.status(201).json({
    message: "password updated!",
    user: userEmail,
    result: result,
  });
}

export default handler;
