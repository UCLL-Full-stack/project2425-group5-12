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

const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
};

export default ProjectService;
