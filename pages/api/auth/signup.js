import {
  connectToDatabase,
  insertNewUser,
  isExistingUser,
} from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

/**
 * It checks if the user is already existed in the database, if not, it creates a new user
 * @param req - The request object.
 * @param res - The response object.
 * @returns a promise.
 */
async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { email, password } = data;

    /* This is a validation for the input. */
    if (
      !email ||
      !password ||
      !email.includes("@") ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "invalid input!" });
      return;
    }

    /* Connecting to the database. */
    const client = await connectToDatabase();

    /* Checking if the user is already existed in the database. */
    const existingUser = await isExistingUser(client, "users", {
      email: email,
    });

    if (existingUser) {
      res.status(422).json({ message: "user is already existed!" });
      client.close();
    } else {
      try {
        /* Hashing the password. */
        const hashedPassword = await hashPassword(password);

        /* Inserting the new user into the database. */
        const result = await insertNewUser(client, "users", {
          email: email,
          password: hashedPassword,
        });

        res.status(201).json({ message: "created user!" });

        client.close();
      } catch (error) {
        res.status(500).json({ message: "error server!" });

        client.close();
      }
    }
  }
}

export default handler;
