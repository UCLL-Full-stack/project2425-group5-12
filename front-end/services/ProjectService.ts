const getAllProjects = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getProjectById = async (id: string) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createProject = async ({
  title,
  description,
  ownerId,
}: {
  title: string;
  description: string;
  ownerId: number;
}) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description, owner: { id: ownerId } }),
  });
};

/*const addTaskByIdByProjectId = async ({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + `/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};*/

const toggleProject = async ({ projectId }: { projectId: string }) => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + `/projects/${projectId}/toggle`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
  /*addTaskByIdByProjectId,*/
  toggleProject,
};

export default ProjectService;
