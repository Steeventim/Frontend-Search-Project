import api from "./api";
import type { Notification } from "../types/notification";

export const notificationService = {
  // Récupérer toutes les notifications de l'utilisateur
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const { data } = await api.get("/notifications");
      return data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  },

  // Récupérer uniquement les notifications non lues
  getUnreadNotifications: async (): Promise<Notification[]> => {
    try {
      const { data } = await api.get("/notifications/unread");
      return data.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des notifications non lues:",
        error
      );
      return [];
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la notification comme lue:",
        error
      );
      return false;
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await api.put("/notifications/read-all");
      return true;
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        error
      );
      return false;
    }
  },

  // Supprimer une notification
  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      return false;
    }
  },
};
