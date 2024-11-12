import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import ProjectDetails from "@/components/projects/ProjectDetails";
import Header from "@/components/header";

const ProjectDetailsOverview: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [rerenderKey, setRerenderKey] = useState<number>(0);

  const router = useRouter();
  const { projectId } = router.query;

  const getProjectById = async () => {
    const response = await ProjectService.getProjectById(projectId as string);
    const project = await response.json();
    setSelectedProject(project);
  };

  useEffect(() => {
    if (projectId) getProjectById();
  }, [projectId, rerenderKey]);

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
            <ProjectDetails
              project={selectedProject}
              rerenderKey={rerenderKey}
              setRerenderKey={setRerenderKey}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default ProjectDetailsOverview;
