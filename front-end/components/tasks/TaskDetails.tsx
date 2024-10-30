import { Task } from "@/types";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  task: Task;
};

const TaskDetails: React.FC<Props> = ({ task }: Props) => {
  return (
    <>
      {task && (
        <table>
          <tr>
            <td>ID:</td>
            <td>{task.id}</td>
          </tr>
          <tr>
            <td>Title:</td>
            <td>{task.title}</td>
          </tr>
          <tr>
            <td>Description:</td>
            <td>{task.description}</td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>{task.done.toString()}</td>
          </tr>
          <tr>
            <td>Deadline:</td>
            <td>{task.deadline.toString()}</td>
          </tr>
          <tr>
            <td>Owner:</td>
            <td>{task.owner.firstName + " " + task.owner.lastName}</td>
          </tr>
          <tr>
            <td>Tags</td>
            <table>
              <tbody>
                {task.tags.map((tag) => (
                  <tr key={tag.id}>
                    <td>{tag.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </tr>
        </table>
      )}
    </>
  );
};

export default TaskDetails;
