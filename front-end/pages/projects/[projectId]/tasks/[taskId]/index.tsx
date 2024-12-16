import Header from "@/components/ui/header";
import TaskDetails from "@/components/tasks/TaskDetails";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";

const TaskDetailsOverview: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId, taskId } = router.query;

  const getTaskById = async () => {
    const response = await TaskService.getTaskById({ id: taskId as string });
    const task = await response.json();
    if (response.ok) {
      return task;
    } else {
      throw new Error(task.message);
    }
  };

  const {
    data: selectedTask,
    isLoading,
    error: errorMessage,
  } = useSWR(`/tasks/${taskId}`, getTaskById);

  useInterval(() => {
    mutate(`/tasks/${taskId}`, getTaskById);
  }, 5000);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <Head>
        <title>PlanIt {selectedTask?.title}</title>
        <meta name="task details" content="task details" />
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
            {selectedTask && <TaskDetails task={selectedTask} />}
          </section>
          {errorMessage && (
            <p className="text-red-400">{errorMessage.message}</p>
          )}
          {isLoading && <p className="text-red-400">{t("loading")}</p>}
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

export default TaskDetailsOverview;
