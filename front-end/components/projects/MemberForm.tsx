import ProjectService from "@/services/ProjectService";
import UserService from "@/services/UserService";
import { StatusMessage, User } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

type Props = {
  addedUsers: Array<User>;
  onClose: () => void;
};

const MemberForm: React.FC<Props> = ({ addedUsers, onClose }: Props) => {
  const [userSearchInput, setUserSearchInput] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const router = useRouter();
  const { projectId } = router.query;

  const getAllUsers = async () => {
    setStatusMessage(null);
    const response = await UserService.getAllUsers();
    const userResponse = await response.json();
    if (response.ok) {
      return userResponse;
    } else {
      throw new Error(userResponse.message);
    }
  };

  const {
    data: allUsers,
    isLoading,
    error: errorMessage,
  } = useSWR<Array<User>>("allUsers", getAllUsers);

  useInterval(() => mutate("allUsers", getAllUsers), 1000);

  const handleUserAdd = async (userId: number) => {
    setStatusMessage(null);
    const response = await ProjectService.addMemberByUserId({
      projectId: String(projectId),
      userId: String(userId),
    });
    const addResponse = await response.json();
    if (response.ok) {
      setStatusMessage({ status: "success", message: addResponse.message });
      setTimeout(() => onClose(), 2000);
      mutate(`projects/${projectId}`);
    } else {
      setStatusMessage({ status: "error", message: addResponse.message });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg space-y-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Add Members</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              placeholder="Search and add a user"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="border-t pt-4">
            <ul className="space-y-2">
              {allUsers &&
                allUsers
                  .filter(
                    (user) =>
                      !addedUsers.some(
                        (addedUser) => addedUser.email === user.email
                      )
                  )
                  .filter((user) =>
                    user.email
                      .toLowerCase()
                      .includes(userSearchInput.toLowerCase())
                  )
                  .map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleUserAdd(user.id)}
                      className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                    >
                      {user.email}
                    </li>
                  ))}
            </ul>
          </div>
          {statusMessage && (
            <div
              className={
                statusMessage.status === "error"
                  ? "text-red-400"
                  : "text-emerald-600"
              }
            >
              {statusMessage.message}
              {errorMessage && (
                <p className="text-red-400">{errorMessage.message}</p>
              )}
              {isLoading && <p className="text-red-400">Loading...</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberForm;
