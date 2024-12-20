import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import TaskDetails from "../components/tasks/TaskDetails";
import TaskService from "../services/TaskService";

const task = {
  id: 1,
  title: "Finish lab2",
  description: "nodejs and express assignment",
  done: false,
  deadline: new Date(),
  owner: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@ucll.be",
    role: "ADMIN",
  },
  tags: [
    {
      id: 1,
      title: "high-priority",
    },
  ],
  projectId: 4,
};

window.React = React;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

let mockTaskServiceToggleTask: jest.SpyInstance<
  Promise<Response>,
  [{ taskId: string }]
>;
let mockTaskServiceDeleteTask: jest.SpyInstance<
  Promise<Response>,
  [{ id: string }]
>;

mockTaskServiceDeleteTask = jest.spyOn(TaskService, "deleteTaskById");
mockTaskServiceToggleTask = jest.spyOn(TaskService, "toggleTask");

beforeAll(() => {
  Object.defineProperty(window, "sessionStorage", {
    value: {
      getItem: jest.fn((key) => {
        switch (key) {
          case "userRole":
            return "ADMIN";
          case "userId":
            return "1";
          default:
            return null;
        }
      }),
    },
  });
});

beforeEach(() => {
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      projectId: "4",
      taskId: "1",
    },
    push: jest.fn(),
  }));
});

test("Renders task title", async () => {
  render(<TaskDetails task={task}></TaskDetails>);
  const title = screen.getByTestId("task-details-title");
  expect(title).toHaveTextContent("Finish lab2");
});

test("Renders task deadline", async () => {
  render(<TaskDetails task={task}></TaskDetails>);
  const deadline = screen.getByTestId("task-details-row-deadline");
  expect(deadline).toHaveTextContent(new Date(task.deadline).toLocaleString());
});

test("Renders task description", async () => {
  render(<TaskDetails task={task}></TaskDetails>);
  const description = screen.getByTestId("task-details-row-description");
  expect(description).toHaveTextContent("nodejs and express assignment");
});

test("Renders task owner", async () => {
  render(<TaskDetails task={task}></TaskDetails>);
  const owner = screen.getByTestId("task-details-row-owner");
  expect(owner).toHaveTextContent("John Doe");
});

test("Renders task tags", async () => {
  render(<TaskDetails task={task}></TaskDetails>);
  const tags = screen.getByTestId("task-details-row-tags");
  expect(tags).toHaveTextContent("high-priority");
});

test("Click on edit redirects to correct page", async () => {
  const push = jest.fn();
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      projectId: "4",
      taskId: "1",
    },
    push,
  }));
  render(<TaskDetails task={task}></TaskDetails>);
  const edit = screen.getByTestId("task-details-edit");
  expect(edit).toBeInTheDocument();
});

test("Click on delete redirects to correct page", async () => {
  const push = jest.fn();
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: {
      projectId: "4",
      taskId: "1",
    },
    push,
  }));

  render(<TaskDetails task={task}></TaskDetails>);
  const deleteButton = screen.getByTestId("task-details-delete");
  expect(deleteButton).toBeInTheDocument();
});
