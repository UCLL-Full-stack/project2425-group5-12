import Header from "@/components/ui/header";
import TaskForm from "@/components/tasks/TaskForm";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const editTask: React.FC = () => {
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
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);

  return (
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
            Back to Task
          </button>
        </div>
        <section className="">
          {selectedTask && <TaskForm task={selectedTask} />}
        </section>
        {errorMessage && <p className="text-red-400">{errorMessage.message}</p>}
        {isLoading && <p className="text-red-400">Loading...</p>}
      </main>
    </div>
  );
};

export default editTask;
