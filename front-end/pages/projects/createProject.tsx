import Header from "@/components/ui/header";
import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const CreateProject: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    const userRole = sessionStorage.getItem("userRole");
    if (
      loggedIn === "false" ||
      loggedIn === null ||
      userRole === null ||
      userRole === "USER"
    ) {
      router.push("/403");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>PlanIt Create Project</title>
        <meta name="create project" content="create project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mr-60">
          <Header />
        </div>
        <main className="flex-1 p-8">
          <div className="flex justify-start">
            <button
              onClick={() => router.push("/projects")}
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              {t("back")}
            </button>
          </div>
          <section className="">
            <ProjectForm />
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

export default CreateProject;
