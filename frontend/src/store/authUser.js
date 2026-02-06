import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useNotificationStore } from "./notification";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  // create a local (dummy) account and persist to localStorage
  createLocalAccount: async (userData) => {
    set({ isSigningUp: true });
    try {
      const user = {
        id: Date.now(),
        name: userData.username || userData.name || "User",
        email: userData.email,
        image: userData.image || "/avatar.png",
        plan: userData.plan || null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("tt_user", JSON.stringify(user));
      set({ user, isSigningUp: false });
      toast.success("Account created successfully");

      // Add notification
      useNotificationStore.getState().addNotification({
        type: "success",
        title: "Account Created",
        message: `Welcome ${user.name}! Your account has been created successfully.`,
      });
    } catch (error) {
      set({ isSigningUp: false });
      toast.error("Signup failed");
      useNotificationStore.getState().addNotification({
        type: "error",
        title: "Signup Failed",
        message: "An error occurred while creating your account.",
      });
    }
  },
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");

      // Add notification
      useNotificationStore.getState().addNotification({
        type: "success",
        title: "Account Created",
        message: `Welcome ${response.data.user.name}! Your account has been created successfully.`,
      });
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
      set({ isSigningUp: false, user: null });
      useNotificationStore.getState().addNotification({
        type: "error",
        title: "Signup Failed",
        message:
          error.response.data.message ||
          "An error occurred while creating your account.",
      });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("/api/v1/auth/login", credentials);
      set({ user: response.data.user, isLoggingIn: false });
    } catch (error) {
      set({ isLoggingIn: false, user: null });
      toast.error(error.response.data.message || "Login failed");
    }
  },
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoggingOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ isLoggingOut: false });
      toast.error(error.response.data.message || "Logout failed");
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/v1/auth/authCheck");

      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      // fallback to localStorage (dummy/local account)
      const raw = localStorage.getItem("tt_user");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          set({ user, isCheckingAuth: false });
        } catch (e) {
          set({ isCheckingAuth: false, user: null });
        }
      } else {
        set({ isCheckingAuth: false, user: null });
      }
      // toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
