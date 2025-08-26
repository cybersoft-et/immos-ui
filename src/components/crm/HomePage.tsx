import { Outlet } from 'react-router-dom';
import Sidebar from './layout/sidebar';
import Header from './layout/header';
import { useState } from 'react';

export default function HomePage() {
    const [isDarkMode, setIsDarkMode] = useState(false);

  // const [sidebarOpen, setSidebarOpen] = useState(true);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement the actual dark mode functionality
  };
  
  return (
    <div className={`${!isDarkMode ?  'flex bg-white text-gray-800' : 'flex bg-gray-900 text-white' } h-screen transition-colors duration-200 overflow-hidden`}>
      {/* Sidebar - Desktop */}
      <Sidebar />      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header/>        
        {/* Dashboard Content */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
            <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
}
