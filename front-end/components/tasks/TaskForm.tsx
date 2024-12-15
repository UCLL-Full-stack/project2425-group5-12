import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { StatusMessage, Tag, Task } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TagService from "@/services/TagService";
import TagForm from "../tags/TagForm";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

type Props = {
  task?: Task;
};

const TaskForm: React.FC<Props> = ({ task }: Props) => {
  const [taskTitle, setTaskTitle] = useState<string>(task?.title || "");
  const [taskDescription, setTaskDescription] = useState<string>(
    task?.description || ""
  );
  const [taskDeadline, setTaskDeadline] = useState<string>(
    task && task.deadline
      ? new Date(task.deadline)
          .toLocaleString("sv-SE", {
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(" ", "T")
      : ""
  );
  const [taskTags, setTaskTags] = useState<Array<Tag>>([]);
  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [deadlineError, setDeadlineError] = useState<string>("");
  const [tagError, setTagError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();
  const { projectId, taskId } = router.query;

  const getTags = async () => {
    const response = await TagService.getAllTags();
    const tags = await response.json();
    if (response.ok) {
      return tags;
    } else {
      throw new Error(tags.message);
    }
  };

  const {
    data: existingTags,
    isLoading,
    error: tagErrorMessage,
  } = useSWR<Array<Tag>>("existingTags", getTags);

  useInterval(() => {
    mutate("existingTags", getTags);
  }, 1000);

  const addNewTag = async ({ title }: { title: string }) => {
    setStatusMessage(null);
    if (
      taskTags.some((tag) => {
        tag.title === title;
      })
    ) {
      setTagError("Tag already exists");
    }
    const response = await TagService.createTag({ title });
    const tagResponse = await response.json();
    if (response.ok) {
      setTaskTags([...taskTags, tagResponse]);
    } else {
      setStatusMessage({ status: "error", message: tagResponse.message });
    }
  };

  const removeTagById = (id: number) => {
    setTaskTags(taskTags.filter((tag) => tag.id !== id));
  };

  useEffect(() => {
    if (task) {
      setTaskTags(task.tags || []);
    }
  }, [task]);

  const validate = (): boolean => {
    setTitleError("");
    setDescriptionError("");
    setDeadlineError("");
    setTagError("");
    setStatusMessage(null);

    if (taskTitle.trim() === "") {
      setTitleError("Title is required!");
      return false;
    }

    if (taskDescription.trim() === "") {
      setDescriptionError("Description is required!");
      return false;
    }

    if (new Date(taskDeadline).getTime() < Date.now()) {
      setDeadlineError("Deadline cannot be in past!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (task) {
      const response = await TaskService.updateTask({
        id: task.id,
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        ownerId: Number(sessionStorage.getItem("userId")),
        tags: taskTags,
        projectId: Number(projectId),
      });
      const updatedTaskResponse = await response.json();
      if (response.ok) {
        setStatusMessage({
          status: "succes",
          message: updatedTaskResponse.message,
        });
        setTimeout(
          () => router.push(`/projects/${projectId}/tasks/${taskId}`),
          2000
        );
      } else {
        setStatusMessage({
          status: "error",
          message: updatedTaskResponse.message,
        });
      }
    } else {
      const response = await TaskService.createTask({
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        ownerId: Number(sessionStorage.getItem("userId")),
        tags: taskTags,
        projectId: Number(projectId),
      });
      const createdTaskResponse = await response.json();
      if (response.ok) {
        setStatusMessage({
          status: "succes",
          message: "Task succesfully created!",
        });
        setTimeout(() => router.push(`/projects/${projectId}`), 2000);
      } else {
        setStatusMessage({
          status: "error",
          message: createdTaskResponse.message,
        });
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        {task ? "Update Task" : "Create New Task"}
      </h2>
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
        />
        {titleError && <div className="text-red-400">{titleError}</div>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
          rows={4}
        />
        {descriptionError && (
          <div className="text-red-400">{descriptionError}</div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Deadline</label>
        <input
          name="deadline"
          type="datetime-local"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
        />
        {deadlineError && <div className="text-red-400">{deadlineError}</div>}
      </div>

      <TagForm
        taskTags={taskTags}
        setTaskTags={setTaskTags}
        existingTags={existingTags || []}
        addNewTag={addNewTag}
      />
      {tagError && <div className="text-red-400">{tagError}</div>}
      {tagErrorMessage && (
        <div className="text-red-400">{tagErrorMessage.message}</div>
      )}
      {isLoading && <div className="text-red-400">Loading...</div>}
      <div className="mb-6">
        <p className="text-gray-700 font-medium mb-2">Added Tags</p>
        <ul className="flex flex-wrap gap-2">
          {taskTags.map((tag) => (
            <li
              key={tag.id}
              className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-emerald-200 transition-colors"
              onClick={() => {
                console.log(taskTags), removeTagById(tag.id);
              }}
            >
              {tag.title}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
      >
        {task ? "Update Task" : "add Task"}
      </button>
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
    </form>
  );
};

export default TaskForm;
