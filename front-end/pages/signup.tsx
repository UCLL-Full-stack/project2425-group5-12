import Header from "@/components/header";
import SignUpForm from "@/components/signup/signUpForm";

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mr-60">
        <Header />
      </div>
      <main className="flex-1 p-8">
        <section className="">
          <SignUpForm />
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
