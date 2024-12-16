import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Language from "../Language/Language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();
  const fetchProjects = async () => {
    const response = await ProjectService.getAllProjects();
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  };

  const {
    data: projects,
    error,
    isLoading,
  } = useSWR<Array<Project>>(
    isLoggedIn ? "projectsHeader" : null,
    isLoggedIn ? fetchProjects : null,
    {
      refreshInterval: 1000,
    }
  );

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn") === "true";
    const role = sessionStorage.getItem("userRole") || "";
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    sessionStorage.setItem("loggedIn", "false");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userID");
    router.push("/login ");
    setIsLoggedIn(false);
  };

  return (
    <aside className="fixed top-0 left-0 w-full md:w-[12rem] bg-emerald-900 text-white z-50 shadow-lg md:h-screen flex flex-col items-center justify-between p-6">
      <Link className="mb-4 flex items-center justify-center group" href="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="group-hover:scale-110 group-hover:text-emerald-300 text-white h-10 w-10 transition-transform"
        >
          <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </svg>
      </Link>
      {(userRole === "ADMIN" || userRole === "PROJECT_MANAGER") && (
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
      )}
      {isLoggedIn && (
        <Link
          className="flex text-2xl items-center justify-center hover:scale-110 hover:text-emerald-300 transition-transform"
          href="/projects"
        >
          {t("header.myProjects")}
        </Link>
      )}
      <div className="flex-1 md:mt-4 overflow-y-scroll scrollbar-hidden">
        <ul className="flex flex-col gap-4 text-white text-sm">
          {isLoggedIn &&
            projects?.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex text-xl items-center justify-center hover:text-emerald-300 transition-transform"
                >
                  {project.title}
                </Link>
              </li>
            ))}
          {error && <li className="text-red-400">{error.message}</li>}
          {isLoading && <li className="text-red-400">{t("loading")}</li>}
        </ul>
      </div>
      {!isLoggedIn && (
        <Link
          className="b-0 flex items-center justify-center group"
          href="/login"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="group-hover:scale-110 group-hover:text-emerald-300 text-white h-10 w-10 transition-transform"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
      {isLoggedIn && (
        <button
          className="b-0 flex items-center justify-center group"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="group-hover:scale-110 group-hover:text-emerald-300 text-white h-10 w-10 transition-transform"
          >
            <path
              fillRule="evenodd"
              d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <Language></Language>
    </aside>
  );
};

export default Header;
