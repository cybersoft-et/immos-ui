import { SetStateAction, useState } from 'react';
import { useNavigate, useLocation, To } from 'react-router-dom';
import { ChevronDown, ChevronRight, LogOut, Settings, HelpCircle } from 'lucide-react';

const Sidebar = ( ) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20}/>, key: "/" },
    { name: "Customer", 
      icon: <NotebookText size={20}/>, 
      key: "customer",
      submenu: [
        { name: "Customer Management", key: "/customerList" },
        { name: "New Client", key: "/customerform/new" },
        { name: "Customer Form V2", key: "/customerformv2/new" },
      ], 
    },
    { name: "CRM Board", icon: <Building size={20}/>, key: "crmBoard" },
    { name: "Sales Pipeline", icon: <ShoppingCart size={20}/>, key: "salesPipeLine" },
    { name: "Messages", icon: <MessageSquare size={20}/>, key: "messages" },
    { name: "Logistics", icon: <Truck size={20}/>, key: "logistics" },
    { name: "Integration", icon: <Link size={20}/>, key: "integration" },
    { name: "Analytics", icon: <TrendingUp size={20}/>, key: "analytics" },
    { name: "Shipping", icon: <Ship size={20}/>, key: "shipping" },
  ];

  const bottomMenuItems = [
    { name: "Settings", icon: <Settings size={20} />, key: "/settings" },
    { name: "Help", icon: <HelpCircle size={20} />, key: "/help" },
    { name: "Sign Out", icon: <LogOut size={20} />, key: "/signout" },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (collapsed) {
      setOpenSubmenu(null);
    }
  };

  const toggleSubmenu = (key: SetStateAction<null>) => {
    if (openSubmenu === key) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(key);
    }
  };

  const handleNavigation = (key: To) => {
    navigate(key);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItems = (items: any[]) => {
     {/* @ts-ignore */}
    return items.map((item) => (
      <div key={item.key} className="mb-1">
        <div 
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
            isActive(item.key) ? 'bg-gray-100' : ''
          }`}
          onClick={() => {
            if (item.submenu) {
              toggleSubmenu(item.key);
            } else {
              handleNavigation(item.key);
            }
          }}
        >
          <div className="flex items-center">
            <div className={`text-gray-600 ${isActive(item.key) ? 'text-orange-500' : ''}`}>
              {item.icon}
            </div>
            {!collapsed && (
              <span className={`ml-3 text-sm font-medium transition-all duration-200 ${
                isActive(item.key) ? 'text-orange-500' : 'text-gray-700'
              }`}>
                {item.name}
              </span>
            )}
          </div>
          {!collapsed && item.submenu && (
            <div>
              {openSubmenu === item.key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>
        
        {!collapsed && item.submenu && openSubmenu === item.key && (
          <div className="ml-6 pl-3 border-l border-gray-200">
            {/* @ts-ignore */}
            {item.submenu.map((subItem) => (
              <div 
                key={subItem.key} 
                className={`flex items-center p-2 my-1 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                  isActive(subItem.key) ? 'text-orange-500 bg-gray-100' : 'text-gray-600'
                }`}
                onClick={() => handleNavigation(subItem.key)}
              >
                {subItem.name}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`h-screen bg-white transition-all duration-300 shadow-md flex flex-col ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="flex items-center p-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <div className="ml-2 font-bold text-orange-500">
              Panafric
              <div className="text-xs font-medium text-gray-500">MTMS</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-full bg-orange-400 flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
        )}
        <button 
          className="ml-auto p-1 rounded-full hover:bg-gray-200 lg:flex hidden"
          onClick={toggleCollapse}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d={collapsed ? "M12 5l-7 7 7 7" : "M12 19l7-7-7-7"} />
          </svg>
        </button>
      </div>

      {/* Main menu items */}
      <div className="flex-1 overflow-y-auto p-3">
        {renderMenuItems(menuItems)}
      </div>

      {/* Bottom menu items */}
      <div className="p-3 border-t">
        {renderMenuItems(bottomMenuItems)}
      </div>
    </div>
  );
};

// Mock components for the icons if not imported
const Home = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const NotebookText = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M6 16h12" />
    <path d="M6 12h12" />
    <path d="M6 8h12" />
  </svg>
);

const ShoppingCart = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const MessageSquare = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Truck = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const Link = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const TrendingUp = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const Building = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="6" x2="12" y2="6.01" />
    <line x1="12" y1="10" x2="12" y2="10.01" />
    <line x1="12" y1="14" x2="12" y2="14.01" />
    <line x1="12" y1="18" x2="12" y2="18.01" />
  </svg>
);

const Ship = (props: { size: string | number | undefined; }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size} 
    height={props.size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 10c0 0-3-1-6-1s-6 1-6 1V5c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z" />
    <path d="M3 10v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2" />
    <path d="M12 22V10" />
    <path d="M19 16l-2 3" />
    <path d="M5 16l2 3" />
  </svg>
);

export default Sidebar;