import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useNotificationStore } from "./notification";

export const useWatchlistStore = create((set) => ({
  watchlist: [],

  loadWatchlist: async () => {
    try {
      const response = await axios.get("/api/v1/profile/watchlist");
      if (response.data.success) {
        set({ watchlist: response.data.watchlist });
      }
    } catch (error) {
      console.log("Error loading watchlist", error);
    }
  },

  addToWatchlist: async (contentData) => {
    try {
      const response = await axios.post(
        "/api/v1/profile/watchlist/add",
        contentData,
      );

      if (response.data.success) {
        set({ watchlist: response.data.watchlist });

        // Add notification
        useNotificationStore.getState().addNotification({
          type: "success",
          title: "Added to Watchlist",
          message: `"${contentData.title}" has been added to your watchlist.`,
        });
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add to watchlist";
      if (!errorMessage.includes("Already in watchlist")) {
        // Don't show error if already in watchlist
        console.log(errorMessage);
        useNotificationStore.getState().addNotification({
          type: "error",
          title: "Failed to Add",
          message: errorMessage,
        });
      } else {
        useNotificationStore.getState().addNotification({
          type: "info",
          title: "Already in Watchlist",
          message: `"${contentData.title}" is already in your watchlist.`,
        });
      }
      return false;
    }
  },

  removeFromWatchlist: async (contentId) => {
    try {
      const response = await axios.post("/api/v1/profile/watchlist/remove", {
        contentId,
      });

      if (response.data.success) {
        set({ watchlist: response.data.watchlist });

        // Add notification
        useNotificationStore.getState().addNotification({
          type: "info",
          title: "Removed from Watchlist",
          message: "This item has been removed from your watchlist.",
        });
        return true;
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove from watchlist";
      console.log(errorMessage);
      useNotificationStore.getState().addNotification({
        type: "error",
        title: "Failed to Remove",
        message: errorMessage,
      });
      return false;
    }
  },

  isInWatchlist: (contentId) => {
    const { watchlist } = useWatchlistStore.getState();
    return watchlist.some((item) => item.contentId === contentId);
  },

  clearWatchlist: () => {
    set({ watchlist: [] });
  },
}));
