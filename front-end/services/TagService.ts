const getAllTags = async () => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const createTag = async ({ title }: { title: string }) => {
  const token = sessionStorage.getItem("token");
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
};

const TagService = {
  getAllTags,
  createTag,
};

export default TagService;
