import Header from "@/components/header";
import TaskDetails from "@/components/tasks/TaskDetails";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TaskDetailsOverview: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [rerenderKey, setRerenderKey] = useState<number>(0);

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
  }, [taskId, rerenderKey]);

  return (
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
            Back to Project
          </button>
        </div>
        <section className="">
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              rerenderKey={rerenderKey}
              setRerenderKey={setRerenderKey}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default TaskDetailsOverview;
