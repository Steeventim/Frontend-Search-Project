"use client";

import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notificationService";
import type { Notification } from "../types/notification";
import websocketService from "../services/websocketService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      setError("Erreur lors du chargement des notifications");
      console.error("Erreur lors du chargement des notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      }
      return success;
    } catch (err) {
      console.error(
        "Erreur lors du marquage de la notification comme lue:",
        err
      );
      return false;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const success = await notificationService.markAllAsRead();
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
      return success;
    } catch (err) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        err
      );
      return false;
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const success = await notificationService.deleteNotification(
          notificationId
        );
        if (success) {
          const notification = notifications.find(
            (n) => n.id === notificationId
          );
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
          if (notification && !notification.read) {
            setUnreadCount((prev) => prev - 1);
          }
        }
        return success;
      } catch (err) {
        console.error("Erreur lors de la suppression de la notification:", err);
        return false;
      }
    },
    [notifications]
  );

  // Gestionnaire pour les nouvelles notifications via WebSocket
  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  // Gestionnaire pour les notifications lues via WebSocket
  const handleNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => prev - 1);
  }, []);

  // Gestionnaire pour les notifications supprimées via WebSocket
  const handleNotificationDeleted = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      const newNotifications = prev.filter((n) => n.id !== notificationId);
      if (notification && !notification.read) {
        setUnreadCount((count) => count - 1);
      }
      return newNotifications;
    });
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Connexion WebSocket
    websocketService.connect();

    // Abonnement aux événements WebSocket
    websocketService.on("notification:new", handleNewNotification);
    websocketService.on("notification:read", handleNotificationRead);
    websocketService.on("notification:deleted", handleNotificationDeleted);

    // Nettoyage
    return () => {
      websocketService.off("notification:new", handleNewNotification);
      websocketService.off("notification:read", handleNotificationRead);
      websocketService.off("notification:deleted", handleNotificationDeleted);
    };
  }, [
    fetchNotifications,
    handleNewNotification,
    handleNotificationRead,
    handleNotificationDeleted,
  ]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

export default useNotifications;
// Note: Ensure to export the hook as default if you want to use it in other components
