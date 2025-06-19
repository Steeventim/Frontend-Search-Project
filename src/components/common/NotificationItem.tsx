import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bell,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Settings,
  Trash2,
  Eye,
} from "lucide-react";
import type { Notification } from "../../types/notification";
import { NOTIFICATION_TYPES } from "../../types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const getNotificationIcon = (type: string) => {
  const iconMap = {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    Settings,
  };

  const iconName =
    NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.icon || "Bell";
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Bell;

  return IconComponent;
};

const getNotificationColor = (type: string) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    yellow: "text-yellow-600 bg-yellow-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
    gray: "text-gray-600 bg-gray-50",
  };

  const color =
    NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES]?.color ||
    "gray";
  return colorMap[color as keyof typeof colorMap] || colorMap.gray;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}) => {
  const IconComponent = getNotificationIcon(notification.type);
  const colorClasses = getNotificationColor(notification.type);

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: fr,
  });

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <div
      className={`p-4 border-l-4 border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? "bg-blue-50 border-l-blue-500" : "bg-white"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Icône */}
          <div className={`p-2 rounded-full ${colorClasses}`}>
            <IconComponent className="h-4 w-4" />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses}`}
              >
                {NOTIFICATION_TYPES[notification.type]?.label ||
                  notification.type}
              </span>
              {!notification.isRead && (
                <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
              )}
            </div>

            <p className="text-sm text-gray-900 mb-1">{notification.message}</p>

            {/* Métadonnées */}
            {notification.metadata && (
              <div className="text-xs text-gray-500 space-y-1">
                {notification.metadata.documentTitle && (
                  <div>Document: {notification.metadata.documentTitle}</div>
                )}
                {notification.metadata.senderName && (
                  <div>De: {notification.metadata.senderName}</div>
                )}
                {notification.metadata.etapeName && (
                  <div>Étape: {notification.metadata.etapeName}</div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Marquer comme lu"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
