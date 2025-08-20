import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotificationSystem } from "../../hooks/useNotificationSystem";
import { NotificationPanel } from "./NotificationPanel";
import { notificationService } from "../../services/notificationService";
import type { Notification } from "../../types/notification";

interface NotificationButtonProps {
  className?: string;
  onClick?: () => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  className = "",
  onClick,
}) => {
  const { unreadCount } = useNotificationSystem();
  const [isOpen, setIsOpen] = useState(false);
  const handleNotificationClick = (notification: Notification) => {
    // Navigation vers la page appropriée selon le type de notification
    const url = notificationService.getNotificationUrl(notification);
    if (url && url !== window.location.pathname) {
      window.location.href = url;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (onClick) onClick();
        }}
        className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
        title="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
};

export default NotificationButton;
