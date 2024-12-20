import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import Header from "@/components/ui/header";

const NoAccess: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>403 - {t("noAccess")}</title>
      </Head>
      <Header></Header>
      <div className="flex flex-col-reverse min-h-screen max-w-screen md:flex-row">
        <main className="flex items-center justify-center flex-grow p-1">
          <section className="max-w-xs space-y-4">
            <h1 className="text-5xl font-bold text-center">403</h1>
            <h2 className="text-3xl font-bold ">{t("noAccessText")}</h2>
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

export default NoAccess;
