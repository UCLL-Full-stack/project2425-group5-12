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
    <div className="flex items-start justify-center min-h-screen">
      <form
        onSubmit={createProject}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Create New Project
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={projectTitle}
            onChange={(change) => setProjectTitle(change.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={projectDescription}
            onChange={(change) => setProjectDescription(change.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
