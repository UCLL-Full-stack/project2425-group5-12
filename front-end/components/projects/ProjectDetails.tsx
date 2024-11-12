import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { Project, Task } from "@/types";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type Props = {
  project: Project;
  rerenderKey: number;
  setRerenderKey: Dispatch<SetStateAction<number>>;
};

const ProjectDetails: React.FC<Props> = ({
  project,
  rerenderKey,
  setRerenderKey,
}: Props) => {
  const [taskToggleId, setTaskToggleId] = useState<string>("");
  const [taskHoverId, setTaskHoverId] = useState<string>("");
  const [projectHover, setProjectHover] = useState<boolean>(false);

  const router = useRouter();
  const { projectId } = router.query;

  const handleTaskToggle = async () => {
    await TaskService.toggleTask({
      taskId: taskToggleId,
    });
    setRerenderKey(rerenderKey + 1);
  };

  const handleProjectToggle = async () => {
    await ProjectService.toggleProject({ projectId: project.id.toString() });
    setRerenderKey(rerenderKey + 1);
  };

  useEffect(() => {
    handleProjectToggle();
  }, []);

  useEffect(() => {
    if (taskToggleId) {
      handleTaskToggle();
    }
  }, [taskToggleId]);

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
                Description:
              </td>
              <td className="px-4 py-2 text-gray-700">{project.description}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">Status:</td>
              <td className="px-4 py-2 text-gray-700">
                {project.done.toString()}
              </td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">Owner:</td>
              <td className="px-4 py-2 text-gray-700">
                {project.owner.firstName + " " + project.owner.lastName}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Tasks</h3>
        {project.tasks.length > 0 ? (
          <table className="min-w-full table-auto text-left border-collapse mt-4">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className=""></th>
                <th className="px-4 py-2 font-medium text-gray-600">Title</th>
                <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  Deadline
                </th>
                <th className="px-4 py-2 font-medium text-gray-600">
                  Assignee
                </th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td>
                    <button
                      onClick={() => {
                        if (task.id.toString() === taskToggleId) {
                          handleTaskToggle();
                        } else {
                          setTaskToggleId(task.id.toString());
                        }
                      }}
                      onMouseEnter={() => setTaskHoverId(task.id.toString())}
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
                  </td>
                  <td
                    className="px-4 py-2 text-gray-700"
                    onClick={() =>
                      router.push(`/projects/${projectId}/tasks/${task.id}`)
                    }
                  >
                    {task.title}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {task.done.toString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {new Date(task.deadline).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {task.owner.firstName + " " + task.owner.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 mt-4">No tasks available.</p>
        )}
        <div className="mt-6">
          <button
            onClick={() => router.push(`/projects/${projectId}/addTask`)}
            className="px-6 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Add Task
          </button>
        </div>

        {/* Project Members Table */}
        {project.members.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-700 mt-6">
              Members
            </h3>
            <table className="min-w-full table-auto text-left border-collapse mt-4">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Firstname
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">
                    Lastname
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-600">Email</th>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
