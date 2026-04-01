import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  notifications: [],
  fetch: async () => {
    const res = await apiRequest("/users/notifications");
    set({
      number: res.data.unseenCount,
      notifications: res.data.notifications,
    });
  },
  markRead: async (id) => {
    await apiRequest.put(`/users/notifications/${id}/read`);
    set((prev) => ({
      number: Math.max(
        0,
        prev.number - (prev.notifications.find((item) => item.id === id && !item.isRead) ? 1 : 0)
      ),
      notifications: prev.notifications.map((item) =>
        item.id === id ? { ...item, isRead: true } : item
      ),
    }));
  },
  reset: () => {
    set({ number: 0, notifications: [] });
  },
}));
