import Header from "@/components/ui/header";
import LoginForm from "@/components/login/LoginForm";
import ProjectForm from "@/components/projects/ProjectForm";
import { useRouter } from "next/router";

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>
      <main className="flex-1 p-8">
        <section className="">
          <LoginForm />
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
