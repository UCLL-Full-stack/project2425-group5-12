import TaskService from "@/services/TaskService";
import { StatusMessage, Task } from "@/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { mutate } from "swr";

type Props = {
  task: Task;
};

const TaskDetails: React.FC<Props> = ({ task }: Props) => {
  const { t } = useTranslation();
  const [taskCheckHover, setTaskCheckHover] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [userRole, setUserRole] = useState<string>();
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();
  const { projectId, taskId } = router.query;

  const handleTaskToggle = async () => {
    await TaskService.toggleTask({ taskId: task.id.toString() });
    mutate(`/tasks/${taskId}`);
  };

  const handleTaskDelete = async (id: number) => {
    setStatusMessage(null);
    const response = await TaskService.deleteTaskById({ id: String(id) });
    const result = await response.json();
    if (response.ok) {
      setStatusMessage({ status: "succes", message: result.message });
      setTimeout(() => {
        router.push("/projects/" + projectId);
      }, 2000);
    } else {
      setStatusMessage({ status: "error", message: result.message });
    }
  };

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    const userId = sessionStorage.getItem("userId");
    setUserId(Number(userId));
    setUserRole(userRole || "");
  });

  return (
    <>
      {task && (
        <div className="m-0 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-semibold text-gray-700">
              {task.title}
            </h2>
            {(userId === task.owner.id || userRole === "ADMIN") && (
              <button
                onClick={() => handleTaskToggle()}
                onMouseEnter={() => setTaskCheckHover(true)}
                onMouseLeave={() => setTaskCheckHover(false)}
              >
                {" "}
                {task.done || taskCheckHover ? (
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
            )}
          </div>
          <table className="w-full border-collapse text-left text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">
                  {t("tasks.details.description")}
                </td>
                <td className="py-3">{task.description}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">
                  {t("tasks.details.deadline")}
                </td>
                <td className="py-3">
                  {new Date(task.deadline).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">
                  {t("tasks.details.owner")}
                </td>
                <td className="py-3">
                  {task.owner.firstName} {task.owner.lastName}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-600 align-top">
                  {t("tasks.details.tags")}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  {(userId === task.owner.id || userRole === "ADMIN") && (
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/projects/${projectId}/tasks/${taskId}/editTask`}
                        className="group"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="group-hover:scale-110 text-black h-10 w-10 transition-transform"
                        >
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                      </Link>
                      <button onClick={() => handleTaskDelete(task.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-7 text-gray-400 hover:text-red-400"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
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
      )}
    </>
  );
};

export default TaskDetails;
