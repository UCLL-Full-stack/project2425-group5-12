import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { Tag, Task } from "@/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TagService from "@/services/TagService";
import TagForm from "../tags/TagForm";

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
  const [existingTags, setExistingTags] = useState<Array<Tag>>([]);
  const [taskTags, setTaskTags] = useState<Array<Tag>>([]);

  const taskOwnerId = 1;
  const router = useRouter();
  const { projectId, taskId } = router.query;

  const getTags = async () => {
    const response = await TagService.getAllTags();
    const tags = await response.json();
    setExistingTags(tags);
  };

  const addNewTag = async ({ title }: { title: string }) => {
    const response = await TagService.createTag({ title });
    if (response.ok) {
      const tag = await response.json();
      setTaskTags([...taskTags, tag]);
    }
    getTags();
  };

  const removeTagById = (id: number) => {
    setTaskTags(taskTags.filter((tag) => tag.id !== id));
  };

  useEffect(() => {
    if (task) {
      setTaskTags(task.tags || []);
    }
  }, [task]);

  useEffect(() => {
    getTags();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (task) {
      const taskResponse = await TaskService.updateTask({
        id: task.id,
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        ownerId: taskOwnerId,
        tags: taskTags,
      });
      if (taskResponse.ok) {
        router.push(`/projects/${projectId}/tasks/${taskId}`);
      }
    } else {
      const taskResponse = await TaskService.createTask({
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        ownerId: taskOwnerId,
        tags: taskTags,
      });
      if (taskResponse.ok) {
        const createdTask = await taskResponse.json();
        const projectResponse = await ProjectService.addTaskByIdByProjectId({
          projectId: projectId as string,
          taskId: createdTask.id as string,
        });
        if (projectResponse.ok) {
          router.push(`/projects/${projectId}`);
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Create New Task
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
      </div>

      <TagForm
        taskTags={taskTags}
        setTaskTags={setTaskTags}
        existingTags={existingTags}
        addNewTag={addNewTag}
      />

      <div className="mb-6">
        <p className="text-gray-700 font-medium mb-2">Added Tags</p>
        <ul className="flex flex-wrap gap-2">
          {taskTags.map((tag) => (
            <li
              key={tag.id}
              className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-emerald-200 transition-colors"
              onClick={() => removeTagById(tag.id)}
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
    </form>
  );
};

export default TaskForm;
