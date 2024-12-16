import ProjectService from "@/services/ProjectService";
import { StatusMessage } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";

const ProjectForm: React.FC = () => {
  const { t } = useTranslation();
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();

  const validate = (): boolean => {
    setTitleError("");
    setStatusMessage(null);

    if (projectTitle.trim() === "") {
      setTitleError(t("projects.form.titleRequired"));
      return false;
    }

    if (projectDescription.trim() === "") {
      setDescriptionError(t("projects.form.descriptionRequired"));
      return false;
    }
    return true;
  };

  const createProject = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const response = await ProjectService.createProject({
      title: projectTitle || "",
      description: projectDescription || "",
      ownerId: Number(sessionStorage.getItem("userId")),
    });
    const projectResponse = await response.json();
    if (response.ok) {
      setStatusMessage({ status: "succes", message: projectResponse.message });
      setTimeout(() => router.push("/projects"), 2000);
    } else {
      setStatusMessage({ status: "error", message: projectResponse.message });
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen">
      <form
        onSubmit={createProject}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          {t("projects.form.createProject")}
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            {t("projects.form.title")}
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
          {titleError && <div className="text-red-400">{titleError}</div>}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            {t("projects.form.description")}
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
          {descriptionError && (
            <div className="text-red-400">{descriptionError}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {t("projects.form.create")}
        </button>
        {statusMessage && (
          <div
            className={
              statusMessage.status === "error"
                ? "text-red-400"
                : "text-emerald-600"
            }
          >
            {statusMessage.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProjectForm;
