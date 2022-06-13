import AuthForm from "../components/auth/auth-form";
import { getSession } from "next-auth/react";

function AuthPage() {
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: { session },
    };
  }
}

export default AuthPage;
