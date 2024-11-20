import ProjectService from "@/services/ProjectService";
import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import { useRouter } from "next/router";
import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();

  const validate = (): boolean => {
    setEmailError("");
    setPasswordError("");
    setStatusMessage(null);

    if (userEmail.trim() === "") {
      setEmailError("Email is required!");
      return false;
    }

    if (userPassword.trim() === "") {
      setPasswordError("Password is required!");
      return false;
    }
    return true;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const response = await UserService.loginByEmail({
      email: userEmail,
      password: userPassword,
    });
    const loggedInUser = await response.json();
    if (response.ok) {
      setStatusMessage({ status: "succes", message: "Logged in succesfully!" });
      sessionStorage.setItem("userId", loggedInUser.userId);
      sessionStorage.setItem("loggedIn", "true");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setStatusMessage({ status: "error", message: loggedInUser.message });
    }
  };
  return (
    <div className="flex items-start justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Login
        </h2>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={userEmail}
            onChange={(change) => setUserEmail(change.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {emailError && <div className="text-red-400">{emailError}</div>}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="text"
            id="password"
            name="password"
            value={userPassword}
            onChange={(change) => setUserPassword(change.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
          />
          {passwordError && <div className="text-red-400">{passwordError}</div>}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Login
        </button>
        {statusMessage && (
          <div
            className={
              statusMessage.status === "error"
                ? "text-red-400"
                : "text-emerald-600"
            }
          >
            {statusMessage.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
