import api from "./api";
import type {
  Notification,
  NotificationResponse,
  UnreadNotificationResponse,
  NotificationActionResponse,
  NotificationStats,
  NotificationFilter,
} from "../types/notification";

class NotificationService {
  /**
   * Récupérer toutes les notifications
   */
  async getAllNotifications(
    filter?: NotificationFilter
  ): Promise<Notification[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.type) params.append("type", filter.type);
      if (filter?.isRead !== undefined)
        params.append("isRead", filter.isRead.toString());
      if (filter?.startDate) params.append("startDate", filter.startDate);
      if (filter?.endDate) params.append("endDate", filter.endDate);
      if (filter?.limit) params.append("limit", filter.limit.toString());
      if (filter?.offset) params.append("offset", filter.offset.toString());

      const url = `/notifications${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await api.get<NotificationResponse>(url);

      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      throw error;
    }
  }

  /**
   * Récupérer les notifications non lues
   */
  async getUnreadNotifications(): Promise<{
    count: number;
    notifications: Notification[];
  }> {
    try {
      const response = await api.get<UnreadNotificationResponse>(
        "/notifications/unread"
      );

      return {
        count: response.data.count,
        notifications: response.data.data,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des notifications non lues:",
        error
      );
      throw error;
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put<NotificationActionResponse>(
        `/notifications/${notificationId}/read`
      );
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<{ updated: number }> {
    try {
      const response = await api.put<NotificationActionResponse>(
        "/notifications/read-all"
      );

      return { updated: response.data.updated || 0 };
    } catch (error) {
      console.error("Erreur lors du marquage global comme lu:", error);
      throw error;
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete<NotificationActionResponse>(
        `/notifications/${notificationId}`
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des notifications
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const [allNotifications, unreadData] = await Promise.all([
        this.getAllNotifications(),
        this.getUnreadNotifications(),
      ]);

      const byType: Record<string, number> = {};
      allNotifications.forEach((notification) => {
        byType[notification.type] = (byType[notification.type] || 0) + 1;
      });

      return {
        total: allNotifications.length,
        unread: unreadData.count,
        byType,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  }

  /**
   * Écouter les nouvelles notifications en temps réel
   */
  subscribeToNotifications(
    callback: (notification: Notification) => void
  ): () => void {
    // Implémentation WebSocket ou Server-Sent Events
    // Pour l'instant, on utilise un polling simple
    const interval = setInterval(async () => {
      try {
        const { notifications } = await this.getUnreadNotifications();
        notifications.forEach(callback);
      } catch (error) {
        console.error("Erreur lors de l'écoute des notifications:", error);
      }
    }, 30000); // Poll toutes les 30 secondes

    return () => clearInterval(interval);
  }

  /**
   * Formater le message de notification selon le type
   */
  formatNotificationMessage(notification: Notification): string {
    const { type, metadata } = notification;

    switch (type) {
      case "document_received":
        return `Nouveau document reçu: ${
          metadata?.documentTitle || "Document"
        }`;
      case "document_pending":
        return `Document en attente d'approbation: ${
          metadata?.documentTitle || "Document"
        }`;
      case "document_approved":
        return `Document approuvé: ${metadata?.documentTitle || "Document"}`;
      case "document_rejected":
        return `Document rejeté: ${metadata?.documentTitle || "Document"}`;
      case "etape_assigned":
        return `Nouvelle étape assignée: ${metadata?.etapeName || "Étape"}`;
      case "system":
        return notification.message;
      default:
        return notification.message;
    }
  }

  /**
   * Obtenir l'URL de navigation pour une notification
   */
  getNotificationUrl(notification: Notification): string {
    const { type, documentId, etapeId } = notification;

    switch (type) {
      case "document_received":
      case "document_pending":
      case "document_approved":
      case "document_rejected":
        return documentId ? `/documents/${documentId}` : "/dashboard";
      case "etape_assigned":
        return etapeId ? `/etapes/${etapeId}` : "/dashboard";
      case "system":
        return "/settings";
      default:
        return "/dashboard";
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
