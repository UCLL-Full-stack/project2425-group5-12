import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import ProjectDetails from "@/components/projects/ProjectDetails";
import Header from "@/components/ui/header";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const ProjectDetailsOverview: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);

  const getProjectById = async () => {
    const response = await ProjectService.getProjectById({
      id: projectId as string,
    });
    const project = await response.json();
    if (response.ok) {
      return project;
    } else {
      throw new Error(project.message);
    }
  };

  const {
    data: selectedProject,
    isLoading,
    error: errorMessage,
  } = useSWR<Project>(`projects/${projectId}`, getProjectById);

  useInterval(() => {
    mutate(`projects/${projectId}`, getProjectById());
  }, 1000);

  return (
    <>
      <Head>
        <title>PlanIt {selectedProject?.title}</title>
        <meta name="project details" content="project details" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <div className="flex min-h-screen bg-gray-50">
        <div className="mr-60">
          <Header />
        </div>
        <main className="flex-1 p-8">
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => router.push("/projects")}
              className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ease-in-out duration-300"
            >
              {t("back")}
            </button>
          </div>
          {selectedProject && (
            <section className="">
              <ProjectDetails project={selectedProject} />
            </section>
          )}
          {errorMessage && (
            <p className="text-red-400">{errorMessage.message}</p>
          )}
          {isLoading && <p className="text-red-400">{t("loading")}</p>}
        </main>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default ProjectDetailsOverview;
