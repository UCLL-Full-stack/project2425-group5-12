import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/router";

const CreateProject: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <ProjectForm />
      <button onClick={() => router.push("/projects")}>Back</button>
    </>
  );
};

export default CreateProject;