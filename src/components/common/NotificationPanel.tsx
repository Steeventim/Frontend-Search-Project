import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Filter, Search } from 'lucide-react';
import { useNotificationSystem } from '../../hooks/useNotificationSystem';
import { NotificationItem } from './NotificationItem';
import type { NotificationFilter } from '../../types/notification';
import { NOTIFICATION_TYPES } from '../../types/notification';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: any) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  onNotificationClick
}) => {
  const {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
    refreshNotifications
  } = useNotificationSystem();

  const [currentFilter, setCurrentFilter] = useState<NotificationFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = async (filter: NotificationFilter) => {
    setCurrentFilter(filter);
    await filterNotifications(filter);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Erreur lors du marquage global:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    onNotificationClick?.(notification);
    onClose();
  };

  const filteredNotifications = notifications.filter(notification =>
    searchTerm === '' || 
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.metadata?.documentTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Tout marquer comme lu</span>
            </button>
            
            <button
              onClick={refreshNotifications}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualiser"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange({})}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                !currentFilter.type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => handleFilterChange({ isRead: false })}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                currentFilter.isRead === false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            {Object.entries(NOTIFICATION_TYPES).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleFilterChange({ type })}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  currentFilter.type === type ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.label} ({stats?.byType[type] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              <p>{error}</p>
              <button
                onClick={refreshNotifications}
                className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune notification à afficher</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Aucun résultat pour "{searchTerm}"
                </p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {stats && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <p>{stats.total} notifications au total</p>
              <p>{stats.unread} non lues</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
