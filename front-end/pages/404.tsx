import Header from "@/components/ui/header";
import Head from "next/head";

function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <Header></Header>
      <div className="flex flex-col-reverse min-h-screen max-w-screen md:flex-row">
        <main className="flex items-center justify-center flex-grow p-1">
          <section className="max-w-xs space-y-4">
            <h1 className="text-5xl font-bold text-center">404</h1>
            <h2 className="text-3xl font-bold ">Page not found</h2>
          </section>
        </main>
      </div>
    </>
  );
}

export default Custom404;
