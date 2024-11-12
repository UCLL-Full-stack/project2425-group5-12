const getAllTags = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createTag = async ({ title }: { title: string }) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
};

const TagService = {
  getAllTags,
  createTag,
};

export default TagService;
