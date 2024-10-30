import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
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
    </>
  );
};

export default Home;
