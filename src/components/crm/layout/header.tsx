import  { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, Search, X } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

type NotificationItemProps = {
  title: string;
  time: string;
  isNew: boolean;
  onClick: () => void;
};

// Notification component
const NotificationItem = ({ title, time, isNew, onClick }: NotificationItemProps) => (
  <div 
    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${isNew ? 'bg-blue-50' : ''}`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
    <p className="text-xs text-gray-600 mt-1">
      {isNew && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>}
      Click to view details
    </p>
  </div>
);

const Header = () => {
  // State management
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Shipment #8f4d43d3-89 arrived", time: "Just now", isNew: true },
    { id: 2, title: "New order from Memphis", time: "2 hours ago", isNew: true },
    { id: 3, title: "Delayed shipment alert", time: "Yesterday", isNew: false },
    { id: 4, title: "Weekly report available", time: "3 days ago", isNew: false },
  ]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would apply the dark mode to the entire application
    // document.documentElement.classList.toggle('dark');
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })));
  };

  // Handle notification click
  const handleNotificationClick = (id: number) => {
    setNotifications(
      notifications.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
    setIsNotificationsOpen(false);
    // In a real app, you would navigate to the notification details
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.isNew).length;

  // Handle search submission
  const handleSearchSubmit = () => {
    // In a real app, you would handle the search logic here
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Handle key press for search
  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`h-16 px-6 flex items-center justify-between border-b ${
      isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'
    }`}>
      {/* Left side - Search */}
      <div className="flex items-center">
        <button 
          className={`p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <Search size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          className={`p-2 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun size={20} className="text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsUserMenuOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={20} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg overflow-hidden z-10 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="p-3 border-b flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    className="text-xs text-blue-500 hover:text-blue-600"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id}
                      title={notification.title}
                      time={notification.time}
                      isNew={notification.isNew}
                      onClick={() => handleNotificationClick(notification.id)}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t text-center">
                <button className="text-sm text-blue-500 hover:text-blue-600">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center space-x-3"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt={user?.userName} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Hey, {user?.userName}
            </span>
            <ChevronDown size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
          
          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden z-10 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="py-1">
                <a 
                  href="#" 
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Your Profile
                </a>
                <a 
                  href="#" 
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Settings
                </a>
                <a 
                  href="#account" 
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Account
                </a>
                <hr className={isDarkMode ? 'border-gray-700' : 'border-gray-200'} />
                <button              
                  onClick={handleLogout}
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'
                  }`}
                >
                  Sign out
                </button>               
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
          <div className={`w-full max-w-2xl rounded-lg shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4 border-b flex items-center">
              <Search size={20} className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search shipments, orders, or customers..."
                  className={`w-full outline-none ${
                    isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className={`p-1 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recent Searches
              </h3>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className={`py-2 px-3 rounded ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } cursor-pointer`}>
                  Memphis shipments
                </div>
                <div className={`py-2 px-3 rounded ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } cursor-pointer`}>
                  Order #8f4d43d3
                </div>
                <div className={`py-2 px-3 rounded ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } cursor-pointer`}>
                  Delayed orders
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;