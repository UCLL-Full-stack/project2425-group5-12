import { Project } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  projects: Array<Project>;
};

const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      {projects && (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                onClick={() => router.push(router.pathname + `/${project.id}`)}
                className={`cursor-pointer ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-emerald-100`}
              >
                <td className="px-4 py-2 border-b border-gray-200">
                  {project.title}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {project.done ? "Completed" : "In Progress"}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {project.owner.firstName} {project.owner.lastName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectOverviewTable;
