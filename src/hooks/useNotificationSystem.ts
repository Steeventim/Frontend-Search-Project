import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService";
import type { 
  Notification, 
  NotificationStats, 
  NotificationFilter 
} from "../types/notification";

interface UseNotificationReturn {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  filterNotifications: (filter: NotificationFilter) => Promise<void>;
}

export const useNotificationSystem = (): UseNotificationReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les notifications
  const loadNotifications = useCallback(async (filter?: NotificationFilter) => {
    try {
      setLoading(true);
      setError(null);
      
      const [allNotifications, unreadData, notificationStats] = await Promise.all([
        notificationService.getAllNotifications(filter),
        notificationService.getUnreadNotifications(),
        notificationService.getNotificationStats()
      ]);

      setNotifications(allNotifications);
      setUnreadCount(unreadData.count);
      setStats(notificationStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des notifications';
      setError(errorMessage);
      console.error('Erreur dans useNotification:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Rafraîchir les notifications
  const refreshNotifications = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Mettre à jour les stats
      if (stats) {
        setStats({
          ...stats,
          unread: Math.max(0, stats.unread - 1)
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du marquage comme lu';
      setError(errorMessage);
      throw err;
    }
  }, [stats]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      const result = await notificationService.markAllAsRead();
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
      
      // Mettre à jour les stats
      if (stats) {
        setStats({
          ...stats,
          unread: 0
        });
      }

      console.log(`${result.updated} notifications marquées comme lues`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du marquage global comme lu';
      setError(errorMessage);
      throw err;
    }
  }, [stats]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Mettre à jour l'état local
      const notificationToDelete = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      
      // Mettre à jour le compteur si la notification était non lue
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Mettre à jour les stats
      if (stats && notificationToDelete) {
        setStats({
          total: stats.total - 1,
          unread: notificationToDelete.isRead ? stats.unread : Math.max(0, stats.unread - 1),
          byType: {
            ...stats.byType,
            [notificationToDelete.type]: Math.max(0, (stats.byType[notificationToDelete.type] || 1) - 1)
          }
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(errorMessage);
      throw err;
    }
  }, [notifications, stats]);

  // Filtrer les notifications
  const filterNotifications = useCallback(async (filter: NotificationFilter) => {
    await loadNotifications(filter);
  }, [loadNotifications]);

  // Charger les notifications au montage du composant
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    const unsubscribe = notificationService.subscribeToNotifications((notification) => {
      // Ajouter la nouvelle notification si elle n'existe pas déjà
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notification.id);
        if (!exists) {
          setUnreadCount(prevCount => prevCount + 1);
          return [notification, ...prev];
        }
        return prev;
      });
    });

    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications
  };
};
