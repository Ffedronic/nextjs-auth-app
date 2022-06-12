import { connectToDatabase, insertNewUser } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const { email, password } = data;

    const client = await connectToDatabase();

    try {
      const hashedPassword = await hashPassword(password);

      const result = await insertNewUser(client, "users", {
        email: email,
        password: hashedPassword,
      });

      res.status(201).json({ message: "created user!" });

      client.close();
    } catch (error) {
      res.status(400).json({ message: "invalid input" });

      client.close();
    }
  }
}

export default handler;
