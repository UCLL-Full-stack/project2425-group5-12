import TaskService from "@/services/TaskService";
import { Task } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  task: Task;
  rerenderKey: number;
  setRerenderKey: Dispatch<SetStateAction<number>>;
};

const TaskDetails: React.FC<Props> = ({
  task,
  rerenderKey,
  setRerenderKey,
}: Props) => {
  const [taskCheckHover, setTaskCheckHover] = useState<boolean>(false);

  const router = useRouter();
  const { projectId, taskId } = router.query;

  const handleProjectToggle = async () => {
    await TaskService.toggleTask({ taskId: task.id.toString() });
    setRerenderKey(rerenderKey + 1);
  };

  return (
    <>
      {task && (
        <div className="m-0 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl font-semibold text-gray-700">
              {task.title}
            </h2>
            <button
              onClick={() => handleProjectToggle()}
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
          </div>
          <table className="w-full border-collapse text-left text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">
                  Description:
                </td>
                <td className="py-3">{task.description}</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">Status:</td>
                <td className="py-3">
                  {task.done ? "Completed" : "Incomplete"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">Deadline:</td>
                <td className="py-3">
                  {new Date(task.deadline).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-semibold text-gray-600">Owner:</td>
                <td className="py-3">
                  {task.owner.firstName} {task.owner.lastName}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-600 align-top">
                  Tags:
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default TaskDetails;
