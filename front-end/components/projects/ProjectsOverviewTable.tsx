import { Project } from "@/types";
import { useRouter } from "next/router";

import React from "react";

type Props = {
  projects: Array<Project>;
};

const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
  const router = useRouter();
  return (
    <>
      {projects && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => router.push(router.pathname + `/${project.id}`)}
                role="button"
              >
                <td>{project.title}</td>
                <td>{project.done.toString()}</td>
                <td>
                  {project.owner.firstName + " " + project.owner.lastName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ProjectOverviewTable;
