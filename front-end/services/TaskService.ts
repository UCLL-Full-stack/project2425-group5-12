const getTaskById = async (id: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const TaskService = {
  getTaskById,
};

export default TaskService;
