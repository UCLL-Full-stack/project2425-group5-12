import Header from "@/components/header";
import TaskForm from "@/components/tasks/TaskForm";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const editTask: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task>();

  const router = useRouter();
  const { projectId, taskId } = router.query;

  // Fetch task details based on taskId
  const getTaskById = async () => {
    const response = await TaskService.getTaskById(taskId as string);
    const task = await response.json();
    setSelectedTask(task);
  };

  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);

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
      </main>
    </div>
  );
};

export default editTask;
