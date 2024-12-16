import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { Project, StatusMessage, Task } from "@/types";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MemberForm from "./MemberForm";
import { mutate } from "swr";
import { useTranslation } from "next-i18next";

type Props = {
  project: Project;
};

const ProjectDetails: React.FC<Props> = ({ project }: Props) => {
  const { t } = useTranslation();
  const [taskToggleId, setTaskToggleId] = useState<string>("");
  const [taskHoverId, setTaskHoverId] = useState<string>("");
  const [projectHover, setProjectHover] = useState<boolean>(false);
  const [showMemberForm, setShowMemberForm] = useState<boolean>(false);
  const [showMemberButton, setShowMemberButton] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [userRole, setUserRole] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();
  const { projectId } = router.query;

  const handleTaskToggle = async () => {
    await TaskService.toggleTask({
      taskId: taskToggleId,
    });
    mutate(`projects/${projectId}`);
  };

  const handleProjectToggle = async () => {
    await ProjectService.toggleProject({ projectId: project.id.toString() });
    mutate(`projects/${projectId}`);
  };

  useEffect(() => {
    if (taskToggleId) {
      handleTaskToggle();
    }
  }, [taskToggleId]);

  const handleTaskDelete = async (id: number) => {
    setStatusMessage(null);
    const response = await TaskService.deleteTaskById({ id: String(id) });
    const result = await response.json();
    if (response.ok) {
      setStatusMessage({ status: "succes", message: result.message });
      mutate(`projects/${projectId}`);
      setTimeout(() => {
        setStatusMessage(null);
      }, 2000);
    } else {
      setStatusMessage({ status: "error", message: result.message });
    }
  };

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole != "USER") {
      setShowMemberButton(true);
    }
    if (project.title === "TO DO") {
      setShowMemberButton(false);
    }
  });

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");
    setUserId(Number(userId));
    setUserRole(userRole || "");
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-semibold text-gray-700">
            {project.title}
          </h2>
          <button
            onClick={() => handleProjectToggle()}
            onMouseEnter={() => setProjectHover(true)}
            onMouseLeave={() => setProjectHover(false)}
          >
            {" "}
            {project.done || projectHover ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-10"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </button>
        </div>

        <table className="min-w-full table-auto text-left border-collapse">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">
                {t("projects.details.description")}
              </td>
              <td className="px-4 py-2 text-gray-700">{project.description}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">
                {t("projects.details.owner")}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {project.owner.firstName + " " + project.owner.lastName}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">
          {t("projects.details.tasks")}
        </h3>
        {project.tasks.length > 0 ? (
          <table className="min-w-full table-auto text-left border-collapse mt-4">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className=""></th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  {t("projects.details.title")}
                </th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  {t("projects.details.deadline")}
                </th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  {t("projects.details.assignee")}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {project.tasks
                .sort((a, b) => {
                  if (a.done === b.done) {
                    return (
                      new Date(a.deadline).getTime() -
                      new Date(b.deadline).getTime()
                    );
                  }
                  return a.done ? 1 : -1;
                })
                .map((task) => (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td>
                      {(userId === task.owner.id || userRole === "ADMIN") && (
                        <button
                          onClick={() => {
                            if (task.id.toString() === taskToggleId) {
                              handleTaskToggle();
                            } else {
                              setTaskToggleId(task.id.toString());
                            }
                          }}
                          onMouseEnter={() =>
                            setTaskHoverId(task.id.toString())
                          }
                          onMouseLeave={() => setTaskHoverId("")}
                        >
                          {task.done || task.id.toString() === taskHoverId ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                    </td>
                    <td
                      className="px-4 py-2 text-gray-700 hover:underline"
                      onClick={() =>
                        router.push(`/projects/${projectId}/tasks/${task.id}`)
                      }
                    >
                      {task.title}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {new Date(task.deadline).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {task.owner.firstName + " " + task.owner.lastName}
                    </td>
                    {(userId === task.owner.id || userRole === "ADMIN") && (
                      <td>
                        <button onClick={() => handleTaskDelete(task.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 text-gray-400 hover:text-red-400"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 mt-4">{t("projects.details.noTasks")}</p>
        )}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/projects/${projectId}/addTask`)}
            className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {t("projects.details.addTask")}
          </button>
        </div>
        {project.members.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mt-6">
              {t("projects.details.members")}
            </h3>
            <table className="min-w-full table-auto text-left border-collapse mt-4">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-2 font-medium text-gray-600">
                    {t("projects.details.firstName")}
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    {t("projects.details.lastName")}
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    {t("projects.details.email")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.members.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="px-4 py-2 text-gray-700">
                      {member.firstName}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {member.lastName}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6">
              {showMemberButton && (
                <button
                  onClick={() => setShowMemberForm(true)}
                  className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {t("projects.details.addMember")}
                </button>
              )}
              {showMemberForm && (
                <MemberForm
                  addedUsers={project.members}
                  onClose={() => setShowMemberForm(false)}
                ></MemberForm>
              )}
            </div>
          </>
        )}
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
      </div>
    </div>
  );
};

export default ProjectDetails;
