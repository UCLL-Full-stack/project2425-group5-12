import Header from "@/components/ui/header";
import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CreateProject: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn === "false") {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>
      <main className="flex-1 p-8">
        <div className="flex justify-start">
          <button
            onClick={() => router.push("/projects")}
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Back
          </button>
        </div>
        <section className="">
          <ProjectForm />
        </section>
      </main>
    </div>
  );
};

export default CreateProject;
