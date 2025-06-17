/**
 * Exemple d'utilisation complète du système de notifications
 *
 * Ce fichier démontre comment utiliser le nouveau système de notifications
 * dans différents contextes de l'application FrontBPMF.
 */

import React, { useState } from "react";
import { useNotificationSystem } from "../hooks/useNotificationSystem";
import { NotificationButton } from "../components/common/NotificationButton";
import { NotificationPanel } from "../components/common/NotificationPanel";
import { notificationService } from "../services/notificationService";
import type { NotificationFilter } from "../types/notification";

// ===================================================================
// 1. EXEMPLE BASIC - Bouton de notification simple
// ===================================================================

export const BasicNotificationExample: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <h1>Mon App</h1>

      {/* Utilisation simple du bouton de notification */}
      <NotificationButton />

      <div>Menu utilisateur...</div>
    </div>
  );
};

// ===================================================================
// 2. EXEMPLE AVANCÉ - Utilisation complète du hook
// ===================================================================

export const AdvancedNotificationExample: React.FC = () => {
  const {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
  } = useNotificationSystem();

  const [filter, setFilter] = useState<NotificationFilter>({});

  // Marquer une notification comme lue
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      console.log(`Notification ${id} marquée comme lue`);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      console.log("Toutes les notifications marquées comme lues");
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Appliquer un filtre
  const handleFilter = async (newFilter: NotificationFilter) => {
    setFilter(newFilter);
    await filterNotifications(newFilter);
  };

  if (loading) return <div>Chargement des notifications...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des Notifications</h2>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-semibold">Total</h3>
          <p className="text-2xl">{stats?.total || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-semibold">Non lues</h3>
          <p className="text-2xl">{unreadCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-semibold">Lues</h3>
          <p className="text-2xl">{(stats?.total || 0) - unreadCount}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={refreshNotifications}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Actualiser
        </button>

        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          Marquer tout comme lu
        </button>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleFilter({})}
          className={`px-3 py-1 rounded ${
            !filter.type ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Toutes
        </button>

        <button
          onClick={() => handleFilter({ isRead: false })}
          className={`px-3 py-1 rounded ${
            filter.isRead === false ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Non lues
        </button>

        <button
          onClick={() => handleFilter({ type: "document_received" })}
          className={`px-3 py-1 rounded ${
            filter.type === "document_received"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Documents reçus
        </button>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded ${
              !notification.isRead
                ? "bg-blue-50 border-blue-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold">{notification.message}</h4>
                <p className="text-sm text-gray-500">
                  Type: {notification.type} | Créé:{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </p>

                {/* Métadonnées */}
                {notification.metadata && (
                  <div className="mt-2 text-xs text-gray-500">
                    {notification.metadata.documentTitle && (
                      <div>Document: {notification.metadata.documentTitle}</div>
                    )}
                    {notification.metadata.senderName && (
                      <div>Expéditeur: {notification.metadata.senderName}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Marquer comme lu
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===================================================================
// 3. EXEMPLE NAVBAR - Intégration dans une navbar personnalisée
// ===================================================================

export const CustomNavbarWithNotifications: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    // Navigation personnalisée selon le type
    const url = notificationService.getNotificationUrl(notification);

    // Fermer le panel
    setIsPanelOpen(false);

    // Naviguer vers l'URL
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Mon App</h1>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              {/* Bouton de notification personnalisé */}
              <NotificationButton
                className="relative"
                onClick={() => setIsPanelOpen(!isPanelOpen)}
              />

              {/* Autres éléments de navigation */}
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Panel de notifications */}
      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

// ===================================================================
// 4. EXEMPLE SERVICE DIRECT - Utilisation du service sans hook
// ===================================================================

export const DirectServiceExample: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les notifications manuellement
  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Récupérer toutes les notifications
      const allNotifications = await notificationService.getAllNotifications();

      // Récupérer les statistiques
      const stats = await notificationService.getNotificationStats();

      // Récupérer les non lues
      const { count, notifications: unread } =
        await notificationService.getUnreadNotifications();

      setNotifications(allNotifications);

      console.log("Statistiques:", stats);
      console.log("Non lues:", count);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Écouter les nouvelles notifications
  React.useEffect(() => {
    const unsubscribe = notificationService.subscribeToNotifications(
      (notification) => {
        console.log("Nouvelle notification reçue:", notification);

        // Ajouter à la liste locale
        setNotifications((prev) => [notification, ...prev]);

        // Afficher une notification browser (optionnel)
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(notification.message, {
            icon: "/favicon.ico",
            body: notificationService.formatNotificationMessage(notification),
          });
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Service Direct</h2>

      <button
        onClick={loadNotifications}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {loading ? "Chargement..." : "Charger les notifications"}
      </button>

      <div className="mt-4">
        <h3 className="font-semibold">
          Notifications chargées: {notifications.length}
        </h3>

        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(notifications.slice(0, 3), null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ===================================================================
// 5. EXEMPLE DASHBOARD - Widget de notifications pour tableau de bord
// ===================================================================

export const NotificationWidget: React.FC = () => {
  const { notifications, unreadCount, stats, refreshNotifications } =
    useNotificationSystem();

  // Récentes notifications (5 dernières)
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications récentes</h3>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} nouvelles
            </span>
          )}

          <button
            onClick={refreshNotifications}
            className="text-gray-500 hover:text-gray-700"
            title="Actualiser"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.total || 0}
          </div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          <div className="text-xs text-gray-500">Non lues</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.byType?.document_approved || 0}
          </div>
          <div className="text-xs text-gray-500">Approuvés</div>
        </div>
      </div>

      {/* Liste des notifications récentes */}
      <div className="space-y-2">
        {recentNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Aucune notification récente
          </p>
        ) : (
          recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded border-l-4 ${
                !notification.isRead
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>

                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lien vers toutes les notifications */}
      {notifications.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 text-sm hover:text-blue-800">
            Voir toutes les notifications ({notifications.length})
          </button>
        </div>
      )}
    </div>
  );
};

// ===================================================================
// EXPORT ALL EXAMPLES
// ===================================================================

export default {
  BasicNotificationExample,
  AdvancedNotificationExample,
  CustomNavbarWithNotifications,
  DirectServiceExample,
  NotificationWidget,
};
