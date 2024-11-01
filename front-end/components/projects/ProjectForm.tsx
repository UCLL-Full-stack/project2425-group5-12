import ProjectService from "@/services/ProjectService";
import { useRouter } from "next/router";
import React, { useState } from "react";

const ProjectForm: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState<string>();
  const [projectDescription, setProjectDescription] = useState<string>();
  let projectOwnerId = 1;
  const router = useRouter();

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await ProjectService.createProject({
      title: projectTitle || "",
      description: projectDescription || "",
      ownerId: projectOwnerId,
    });
    if (response.ok) {
      router.push("/projects");
    }
  };
  return (
    <>
      <form onSubmit={createProject}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={projectTitle}
              onChange={(change) => setProjectTitle(change.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              name="description"
              value={projectDescription}
              onChange={(change) => setProjectDescription(change.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default ProjectForm;
