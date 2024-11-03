import Header from "@/components/header";
import TaskDetails from "@/components/tasks/TaskDetails";
import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TaskDetailsOverview: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task>();

  const router = useRouter();
  const { projectId, taskId } = router.query;

  const getTaskById = async () => {
    const response = await TaskService.getTaskById(taskId as string);
    const task = await response.json();
    setSelectedTask(task);
  };

  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);

  return (
    <>
      <Header></Header>
      {selectedTask && <TaskDetails task={selectedTask} />}
      <button onClick={() => router.push(`/projects/${projectId}`)}>
        Back
      </button>
    </>
  );
};

export default TaskDetailsOverview;
