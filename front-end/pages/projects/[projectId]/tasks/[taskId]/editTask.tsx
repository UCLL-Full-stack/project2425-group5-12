import Header from "@/components/ui/header";
import TaskForm from "@/components/tasks/TaskForm";
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

const editTask: React.FC = () => {
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
  }, 1000);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    const userId = sessionStorage.getItem("userId");
    const userRole = sessionStorage.getItem("userRole");
    if (loggedIn === "false" || loggedIn === null) {
      router.push("/403");
      return;
    }

    if (
      selectedTask &&
      userRole != "ADMIN" &&
      selectedTask.owner.id != userId
    ) {
      router.push("/403");
      return;
    }
  }, [router, selectedTask]);

  return (
    <>
      <Head>
        <title>PlanIt Update Task</title>
        <meta name="edit task" content="edit task" />
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
              onClick={() =>
                router.push(`/projects/${projectId}/tasks/${taskId}`)
              }
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ease-in-out duration-300"
            >
              {t("tasks.edit.backToTask")}
            </button>
          </div>
          <section className="">
            {selectedTask && <TaskForm task={selectedTask} />}
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

export default editTask;
