import { useEffect, useState } from "react";
import { Home, ChevronLeft , ChevronRight , Building, MessageSquare, TrendingUp, Camera, Truck, Link, ShoppingCart, Ship, Settings, HelpCircle, LogOut, ChevronDown, NotebookText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: <Home size={20}/>, key: "dashboard" },
  { name: "Customer", 
    icon: <NotebookText size={20}/>, 
    key: "customer",
    submenu: [
      { name: "Customer Form", key: "customerForm" },
      { name: "Customer Table", key: "GridCustomers" },
    ], 
  },
  { name: "Orders", icon: <ShoppingCart size={20}/>, key: "orders" },
  { name: "Messages", icon: <MessageSquare size={20}/>, key: "messages" },
  { name: "Camera", icon: <Camera size={20}/>, key: "camera" },
  { name: "Logistics", icon: <Truck size={20}/>, key: "logistics" },
  { name: "Integration", icon: <Link size={20}/>, key: "integration" },
  { name: "Analytics", icon: <TrendingUp size={20}/>, key: "analytics" },
  { name: "Buildings", icon: <Building size={20}/>, key: "buildings" },
  { name: "Shipping", icon: <Ship size={20}/>, key: "shipping" },
];

const Sidebar = () => {

  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const navigate = useNavigate();

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (active !== null) {
      navigate(active.toLowerCase().replace(" ", ""));
    }
  }, [active, navigate]);

  return (
    <div className={`h-screen ${collapsed ? "w-16" : "w-48"} bg-white border-r flex flex-col items-center py-4 space-y-6 transition-width duration-300`}>
      <div className="flex items-center space-x-2 text-orange-600 font-bold text-sm">
        <span className={`${collapsed ? "hidden" : "block"}`}>Panafric G.L. MTMS</span>
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-600">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex-1">        
        {menuItems.map((item) => (
          <div key={item.key} className="w-full">
            <div
              className={`p-2 rounded-lg cursor-pointer flex items-center space-x-2 ${active === item.key ? "text-orange-600" : "text-black"}`}
              onClick={() => (item.submenu ? toggleSubmenu(item.key) : setActive(item.key))}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.submenu && (
                <button onClick={(e) => { e.stopPropagation(); toggleSubmenu(item.key); }} className="ml-auto">
                  <ChevronDown className={`${openSubmenus[item.key] ? "rotate-180" : ""} transition-transform`} />
                </button>
              )}
            </div>
            {!collapsed && openSubmenus[item.key] && item.submenu && (
              <div className="ml-6 space-y-2">
                {item.submenu.map((sub) => (
                  <div
                    key={sub.key}
                    className={`p-2 rounded-lg cursor-pointer ${active === sub.key ? "text-orange-600" : "text-black"}`}
                    onClick={() => setActive(sub.key)}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      { !collapsed ? (
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
            <Settings size={20} />
            <span>Settings</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
            <HelpCircle size={20} />
            <span>Help</span>
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
            <LogOut size={20} />
          <span>Sign Out</span>
          </div>
      </div>      
      ) : (
        <div className="flex flex-col space-y-4 mt-auto mb-4">
          <Settings className="text-gray-500 cursor-pointer" />
          <HelpCircle className="text-gray-500 cursor-pointer" />
          <LogOut className="text-gray-500 cursor-pointer" />
      </div>
      ) }
      
    </div>
  );
};


export default Sidebar;
