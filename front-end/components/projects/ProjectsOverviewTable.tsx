import { Project } from "@/types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

type Props = {
  projects: Array<Project>;
};

const ProjectOverviewTable: React.FC<Props> = ({ projects }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      {projects && (
        <table
          data-testid={"projects-table"}
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">
                {t("projects.overview.title")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("projects.overview.status")}
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                {t("projects.overview.owner")}
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr
                key={project.id}
                data-testid={`projects-table-row-${project.id}`}
                onClick={() => router.push(`projects/${project.id}`)}
                className={`cursor-pointer ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-emerald-100`}
              >
                <td className="px-4 py-2 border-b border-gray-200">
                  {project.title}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {project.done
                    ? t("projects.overview.completed")
                    : t("projects.overview.progress")}
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
