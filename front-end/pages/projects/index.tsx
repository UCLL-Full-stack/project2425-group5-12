import Header from "@/components/header";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);

  const router = useRouter();
  const getAllProjects = async () => {
    const response = await ProjectService.getAllProjects();
    const projects = await response.json();
    setProjects(projects);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <>
      <Header></Header>
      <main>
        {projects && <ProjectOverviewTable projects={projects} />}
        <button onClick={() => router.push(`/projects/createProject`)}>
          New Project
        </button>
      </main>
    </>
  );
};

export default Projects;
