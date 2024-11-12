import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [projects, setProjects] = useState<Array<Project>>([]);

  const getAllProjects = async () => {
    const response = await ProjectService.getAllProjects();
    const projects = await response.json();
    setProjects(projects);
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full md:w-[12rem] bg-emerald-900 text-white z-50 shadow-lg md:h-screen flex flex-col items-center justify-between p-6">
      {/* Home Icon Link */}
      <Link className="mb-4 flex items-center justify-center group" href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="group-hover:scale-110 group-hover:text-emerald-300 text-white h-10 w-10 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>
      </Link>
      <Link
        className="flex mb-8 items-center justify-center group"
        href="/projects/createProject"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
          className="group-hover:scale-110 group-hover:text-emerald-300 text-white h-10 w-10 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
      <Link
        className="flex text-2xl items-center justify-center hover:scale-110 hover:text-emerald-300 transition-transform"
        href="/projects"
      >
        My Projects:
      </Link>
      <div className="flex-1 md:mt-4 overflow-y-scroll scrollbar-hidden">
        <ul className="flex flex-col gap-4 text-white text-sm">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/projects/${project.id}`}
                className=" flex text-xl items-center justify-center hover:text-emerald-300 transition-transform"
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
