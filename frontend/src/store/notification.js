import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Auto-remove after 5 seconds if no action is needed
    if (!notification.action) {
      setTimeout(() => {
        get().removeNotification(id);
      }, 5000);
    }

    return id;
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));
