import { fireEvent, render, screen } from "@testing-library/react";
import ProjectOverviewTable from "../components/projects/ProjectsOverviewTable";
import React from "react";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

const fullStack = {
  id: 1,
  title: "Full-Stack",
  description: "Full-Stack Course",
  done: false,
  tasks: [],
  owner: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@ucll.be",
    role: "ADMIN",
  },
  members: [],
};

const daml = {
  id: 2,
  title: "Daml",
  description: "Data analytics and machine learning",
  done: true,
  tasks: [],
  owner: {
    id: 3,
    firstName: "Jack",
    lastName: "Moe",
    email: "jack.moe@ucll.be",
    role: "PROJECT_MANAGER",
  },
  members: [],
};

const projects = [fullStack, daml];

window.React = React;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

test("Renders page title", async () => {
  render(<ProjectOverviewTable projects={projects} />);
  expect(screen.getByText("projects.overview.title"));
});

test("Renders projects table", async () => {
  render(<ProjectOverviewTable projects={projects} />);
  const table = screen.getByTestId("projects-table");
  expect(table).toBeInTheDocument();
});

test("Renders projects table rows with data", async () => {
  render(<ProjectOverviewTable projects={projects} />);
  const fullStack = screen.getByTestId("projects-table-row-1");
  expect(fullStack).toHaveTextContent("Full-Stack");
  expect(fullStack).toHaveTextContent("projects.overview.progress");
  expect(fullStack).toHaveTextContent("John Doe");
  const daml = screen.getByTestId("projects-table-row-2");
  expect(daml).toHaveTextContent("Daml");
  expect(daml).toHaveTextContent("projects.overview.completed");
  expect(daml).toHaveTextContent("Jack Moe");
});

test("CLick on project redirects to correct page", async () => {
  const push = jest.fn();

  (useRouter as jest.Mock).mockImplementation(() => ({
    push,
  }));
  render(<ProjectOverviewTable projects={projects} />);
  const fullStack = screen.getByTestId("projects-table-row-1");
  fireEvent.click(fullStack);
  expect(push).toHaveBeenCalledWith("projects/1");
});
