import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import ProjectDetails from "@/components/projects/ProjectDetails";
import Header from "@/components/header";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const ProjectDetailsOverview: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const getProjectById = async () => {
    const response = await ProjectService.getProjectById(projectId as string);
    const project = await response.json();
    if (response.ok) {
      return project;
    } else {
      throw new Error(project.message);
    }
  };

  const {
    data: selectedProject,
    isLoading,
    error: errorMessage,
  } = useSWR<Project>(`projects/${projectId}`, getProjectById);

  useInterval(() => {
    mutate(`projects/${projectId}`, getProjectById());
  }, 1000);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>
      <main className="flex-1 p-8">
        <div className="mt-6 flex justify-start">
          <button
            onClick={() => router.push("/projects")}
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ease-in-out duration-300"
          >
            Back
          </button>
        </div>
        {selectedProject && (
          <section className="">
            <ProjectDetails project={selectedProject} />
          </section>
        )}
        {errorMessage && <p className="text-red-400">{errorMessage.message}</p>}
        {isLoading && <p className="text-red-400">Loading...</p>}
      </main>
    </div>
  );
};

export default ProjectDetailsOverview;
