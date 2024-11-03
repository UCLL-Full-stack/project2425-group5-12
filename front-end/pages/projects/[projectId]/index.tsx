import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import ProjectDetails from "@/components/projects/ProjectDetails";
import Header from "@/components/header";

const ProjectDetailsOverview: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>();

  const router = useRouter();
  const { projectId } = router.query;

  const getProjectById = async () => {
    const response = await ProjectService.getProjectById(projectId as string);
    const project = await response.json();
    setSelectedProject(project);
  };

  useEffect(() => {
    if (projectId) getProjectById();
  }, [projectId]);

  return (
    <>
      <Header></Header>
      {selectedProject && <ProjectDetails project={selectedProject} />}
      <button onClick={() => router.push("/projects")}>Back</button>
    </>
  );
};

export default ProjectDetailsOverview;
