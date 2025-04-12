import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";
export const Navbar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) return null;
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });
  const queryClient = useQueryClient();
  // notification

  // In Navbar.jsx
  const { data: notifications } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/notification");
        return res.data;
      } catch (error) {
        console.error("Notification error:", error);
        if (error.response && error.response.status !== 401) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
        return []; //
      }
    },
    enabled: !!authUser,
  });

  // Connection request
  const { data: connectionRequest } = useQuery({
    queryKey: ["connectionRequest"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/connection/requests");
        return res.data;
      } catch (error) {
        if (error.response) {
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong");
      }
    },
    enabled: !!authUser,
  });

  // logout
  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logout successfully");
    },
  });

  // Fix the unread count calculation
  const unreadNotification = notifications
    ? notifications.filter((notif) => !notif.read).length
    : 0;
  const unreadRequest = connectionRequest?.length;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <img
                className="h-8 rounded"
                src="/small-logo.png"
                alt="LinkedIn"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to={"/"}
                  className="text-neutral flex flex-col items-center"
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">My Network</span>
                  {unreadRequest > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                  rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadRequest}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notification"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotification > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
                  rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotification}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logout()}
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="  px-5 py-3 text-blue-600 border border-blue-600 rounded-full  cursor-pointer hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-3 text-black font-bold hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
