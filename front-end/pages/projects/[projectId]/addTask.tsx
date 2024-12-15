import Header from "@/components/ui/header";
import TaskForm from "@/components/tasks/TaskForm";
import { useRouter } from "next/router";
import { useEffect } from "react";

const AddTask: React.FC = () => {
  const router = useRouter();
  const { projectId } = router.query;
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
        <div className="mt-6 flex justify-start">
          <button
            onClick={() => router.push(`/projects/${projectId}`)}
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition ease-in-out duration-300"
          >
            Back to Project
          </button>
        </div>
        <section className="">
          <TaskForm />
        </section>
      </main>
    </div>
  );
};

export default AddTask;
