import Header from "@/components/ui/header";
import TaskForm from "@/components/tasks/TaskForm";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

const AddTask: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId } = router.query;
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Head>
        <title>PlanIt Add Task</title>
        <meta name="add task" content="add task" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mr-60">
          <Header />
        </div>
        <main className="flex-1 p-8">
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ease-in-out duration-300"
            >
              {t("tasks.add.backToProject")}
            </button>
          </div>
          <section className="">
            <TaskForm />
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

export default AddTask;
