import Head from "next/head";
import Header from "@/components/header";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, []);
  return (
    <>
      <Head>
        <title>PlanIt</title>
        <meta name="homepage" content="homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
    </>
  );
};

export default Home;
