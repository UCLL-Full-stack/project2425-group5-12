import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserService from "@/services/UserService";
import { StatusMessage } from "@/types";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [userId, setUserId] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  const validate = (): boolean => {
    setEmailError("");
    setPasswordError("");
    setStatusMessage(null);

    if (userEmail.trim() === "") {
      setEmailError(t("login.form.emailRequired"));
      return false;
    }

    if (userPassword.trim() === "") {
      setPasswordError(t("login.form.passwordRequired"));
      return false;
    }
    return true;
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    const response = await UserService.loginByEmail({
      email: userEmail,
      password: userPassword,
    });

    const loggedInUser = await response.json();
    if (response.ok) {
      setStatusMessage({
        status: "success",
        message: t("login.form.succesfullyLoggedIn"),
      });
      setUserId(loggedInUser.userId);
      setUserRole(loggedInUser.userRole);
      setToken(loggedInUser.token);
      setLoggedIn(true);
      setTimeout(() => router.push("/projects"), 2000);
    } else {
      setStatusMessage({ status: "error", message: loggedInUser.message });
    }
  };

  useEffect(() => {
    if (userId && userRole && token) {
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userRole", userRole);
      sessionStorage.setItem("loggedIn", String(loggedIn));
      sessionStorage.setItem("token", token);
    }
  }, [userId, userRole, token, loggedIn]);

  return (
    <div className="flex items-start justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          {t("login.form.login")}
        </h2>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            {t("login.form.email")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
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
            {t("login.form.password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>
          </div>
          {passwordError && <div className="text-red-400">{passwordError}</div>}
        </div>
        <div className="flex items-center space-x-2">
          <p>{t("login.form.new")}</p>
          <Link
            href="/signup"
            className="text-green-600 underline hover:text-green-800"
          >
            {t("login.form.createAccount")}
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          {t("login.form.login")}
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
