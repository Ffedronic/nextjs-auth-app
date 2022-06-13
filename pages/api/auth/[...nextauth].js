import nextAuth from "next-auth";
import Providers from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { connectToDatabase, isExistingUser } from "../../../lib/db";

export default nextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers({
      async authorize(credentials) {
        const client = await connectToDatabase();

        const existingUser = await isExistingUser(client, "users", {
          email: credentials.email,
        });

        if (!existingUser) {
          client.close();
          throw new Error("No user found!");
        }

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
