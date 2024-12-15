const getAllProjects = async () => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getProjectById = async ({ id }: { id: string }) => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, owner: { id: ownerId } }),
  });
};

const toggleProject = async ({ projectId }: { projectId: string }) => {
  const token = sessionStorage.getItem("token");
  return fetch(
    process.env.NEXT_PUBLIC_API_URL + `/projects/${projectId}/toggle`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const addMemberByUserId = async ({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) => {
  const token = sessionStorage.getItem("token");
  return fetch(
    process.env.NEXT_PUBLIC_API_URL +
      `/projects/${projectId}/members/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const ProjectService = {
  getAllProjects,
  getProjectById,
  createProject,
  toggleProject,
  addMemberByUserId,
};

export default ProjectService;
