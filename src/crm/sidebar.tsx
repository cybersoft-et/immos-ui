import { useState } from "react";
import { Home, Package, Mail, CreditCard, Truck, Link, LineChart, Ship, Settings, HelpCircle, LogOut } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <Home size={20} /> },
  { name: "Order Tracking", icon: <Package size={20} /> },
  { name: "Messages", icon: <Mail size={20} /> },
  { name: "Billings", icon: <CreditCard size={20} /> },
  { name: "Shipments", icon: <Truck size={20} /> },
  { name: "CRM", icon: <Link size={20} />, active: true },
  { name: "Marketing", icon: <LineChart size={20} /> },
  { name: "Terminals", icon: <Ship size={20} /> },
  { name: "Carriers", icon: <Ship size={20} /> },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("CRM");

  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col p-5">
      <div className="text-orange-600 font-bold text-xl mb-6">Panafric MTMS</div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              activeItem === item.name ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
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
    </div>
  );
};

export default Sidebar;
