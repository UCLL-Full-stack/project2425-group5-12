import Header from "@/components/ui/header";
import LoginForm from "@/components/login/LoginForm";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Planit Login</title>
        <meta name="login" content="login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mr-60">
          <Header />
        </div>
        <main className="flex-1 p-8">
          <section className="">
            <LoginForm />
          </section>
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default LoginPage;
