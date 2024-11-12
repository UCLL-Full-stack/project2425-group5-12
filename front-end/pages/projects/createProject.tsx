import Header from "@/components/header";
import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/router";

const CreateProject: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>

      {/* Main Content */}
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
