"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Clock,
  MessageSquare,
  Trash2,
  XCircle,
} from "lucide-react";
import type { Notification, NotificationType } from "../../types/notification";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface NotificationCenterProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => Promise<boolean>;
  onMarkAllAsRead: () => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onNotificationClick?: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "process_assigned":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "process_approved":
        return <Check className="h-5 w-5 text-green-500" />;
      case "process_rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "comment_added":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "deadline_approaching":
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: fr,
    });
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await onMarkAsRead(notification.id);
    }

    if (onNotificationClick) {
      onNotificationClick(notification);
    } else {
      // Navigation par défaut
      if (notification.processId) {
        navigate(`/processes/${notification.processId}`);
      } else if (notification.documentId) {
        navigate(`/search?document=${notification.documentId}`);
      }
    }

    setIsOpen(false);
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    await onDelete(notificationId);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span className="sr-only">Voir les notifications</span>
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <span className="text-xs text-gray-500">
                      {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                    </span>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {loading && notifications.length === 0 ? (
                  <div className="py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">
                      Chargement des notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    Aucune notification
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`py-3 px-2 flex items-start cursor-pointer hover:bg-gray-50 rounded-md ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {formatNotificationTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) =>
                          handleDeleteNotification(e, notification.id)
                        }
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
