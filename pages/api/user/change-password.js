import { getSession } from "next-auth/react";
import {
  hashPassword,
  modifyPassword,
  verifyPassword,
} from "../../../lib/auth";
import { connectToDatabase, isExistingUser } from "../../../lib/db";

async function handler(req, res) {
  if (req.method === "POST") {

    const session = await getSession({ req: req });

    const data = req.body;

    const { oldPassword, newPassword } = data;
    
    if (!session) {
      res.status(401).json({ message: "not authenticated!" });
    }

    const userEmail = session.user.email;

    const client = await connectToDatabase();

    const existingUser = await isExistingUser(client, "users", {
      email: userEmail,
    });

    if (!existingUser) {
      client.close();
      res
        .status(404)
        .json({ message: "not authorized to change this password!" });
      return;
    }

    const currentPassword = existingUser.password;

    const areEqual = await verifyPassword(oldPassword, currentPassword);

    if (!areEqual) {
      client.close();
      res.status(422).json({ message: "invalid password!" });
      return;
    }

    const hashedNewPassword = await hashPassword(newPassword);

    const userModifiedPassword = await modifyPassword(
      client,
      "users",
      { email: userEmail },
      hashedNewPassword
    );

    if (!userModifiedPassword) {
      client.close();
      res.status(422).json({ message: "not modified password!" });
      return;
    }

    client.close();

    res.status(201).json({ message: "modified password!" });
  }
}

export default handler;
