import Header from "@/components/ui/header";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Projects: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  const getAllProjects = async () => {
    const response = await ProjectService.getAllProjects();
    const projects = await response.json();
    if (response.ok) {
      return projects;
    } else {
      throw new Error(projects.message);
    }
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);

  const {
    data: projects,
    error: errorMessage,
    isLoading,
  } = useSWR<Array<Project>>("projectsTable", getAllProjects);

  useInterval(() => {
    mutate("projectsTable", getAllProjects);
  }, 1000);

  useEffect(() => {
    console.log(sessionStorage.getItem("userRole"));
    const role = sessionStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Projects Overview
        </h1>

        <div className="mb-4 flex justify-start">
          {(userRole === "ADMIN" || userRole === "PROJECT_MANAGER") && (
            <button
              onClick={() => router.push(`/projects/createProject`)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition ease-in-out duration-300"
            >
              New Project
            </button>
          )}
        </div>
        <section className="mb-8">
          {projects && <ProjectOverviewTable projects={projects} />}
        </section>
        {errorMessage && <p className="text-red-400">{errorMessage.message}</p>}
        {isLoading && <p className="text-red-400">Loading...</p>}
        {!errorMessage && projects && projects.length === 0 && (
          <p className="text-red-400">No projects found!</p>
        )}
      </main>
    </div>
  );
};

export default Projects;
