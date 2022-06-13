import nextAuth from "next-auth";
import Providers from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase, isExistingUser } from "../../../lib/db";

/* A function that allows you to handle signing with crendentials(email, password) */
export default nextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers({
      async authorize(credentials) {
/* Connecting to the database. */
        const client = await connectToDatabase();

        /* Checking if the user exists in the database. */
        const existingUser = await isExistingUser(client, "users", {
          email: credentials.email,
        });

        if (!existingUser) {
          client.close();
          throw new Error("No user found!");
        }

       /* Checking if the password is valid. */
        const isValid = await verifyPassword(
          credentials.password,
          existingUser.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();

        return { email: existingUser.email };
      },
    }),
  ],
});
