import { Tag } from "@/types";

const getTaskById = async ({ id }: { id: string }) => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const deleteTaskById = async ({ id }: { id: string }) => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks/" + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/tasks/${taskId}/toggle`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const TaskService = {
  getTaskById,
  createTask,
  toggleTask,
  updateTask,
  deleteTaskById,
};

export default TaskService;
