import { Tag } from "@/types";

const getTaskById = async (id: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createTask = async ({
  title,
  description,
  deadline,
  ownerId,
  tags,
  projectId,
}: {
  title: string;
  description: string;
  deadline: string;
  ownerId: number;
  tags: Tag[];
  projectId: number;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      deadline,
      owner: { id: ownerId },
      tags,
      projectId,
    }),
  });
};

const updateTask = async ({
  id,
  title,
  description,
  deadline,
  ownerId,
  tags,
  projectId,
}: {
  id: number;
  title: string;
  description: string;
  deadline: string;
  ownerId: number;
  tags: Tag[];
  projectId: number;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      title,
      description,
      deadline,
      owner: { id: ownerId },
      tags,
      projectId,
    }),
  });
};

const toggleTask = async ({ taskId }: { taskId: string }) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/tasks/${taskId}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const TaskService = {
  getTaskById,
  createTask,
  toggleTask,
  updateTask,
};

export default TaskService;
