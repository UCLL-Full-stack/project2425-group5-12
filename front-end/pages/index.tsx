import Head from "next/head";
import Header from "@/components/ui/header";
import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>PlanIt</title>
        <meta name="homepage" content="homepage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mr-60"></div>
        <main className="flex-1 p-8">
          <section className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">
                      Password
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-200">
                      john.doe@ucll.be
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      john123
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      ADMIN
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-200">
                      jack.moe@ucll.be
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      jack123
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      PROJECT MANAGER
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-200">
                      jane.toe@ucll.be
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">
                      jane123
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200">USER</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
