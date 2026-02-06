import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useNotificationStore } from "../store/notification";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, removeNotification, clearAllNotifications } =
    useNotificationStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="size-5 text-green-500" />;
      case "error":
        return <AlertCircle className="size-5 text-red-500" />;
      case "info":
        return <Info className="size-5 text-blue-500" />;
      default:
        return <Bell className="size-5 text-gray-400" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-all duration-200 group hidden sm:block"
      >
        <Bell className="size-5 text-gray-300 group-hover:text-white group-hover:scale-110 transition-transform duration-200" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 size-5 bg-red-600 rounded-full border-2 border-black text-white text-xs flex items-center justify-center font-semibold">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-h-96 bg-black/95 backdrop-blur-md rounded-lg border border-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
            <h3 className="font-semibold text-white text-lg">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="size-12 text-gray-600 mb-3 opacity-50" />
              <p className="text-gray-400 text-center text-sm">
                No notifications yet
              </p>
              <p className="text-gray-600 text-xs mt-2">
                We'll let you know when something happens
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-4 border-b border-gray-800/50 hover:bg-white/5 transition-colors duration-150 group"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm line-clamp-2">
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-gray-600 text-xs mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
