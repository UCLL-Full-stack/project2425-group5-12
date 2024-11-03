import Head from "next/head";
import Header from "@/components/header";
import React from "react";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>TaskIt</title>
        <meta name="homepage" content="homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <main>
        Welcome to TaskIt! Organise, plan and maintain tasks and projects with
        ease!
      </main>
    </>
  );
};

export default Home;
