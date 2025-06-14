import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './layout/sidebar';
import Header from './layout/header';

export default function Home() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   // Here you would implement the actual dark mode functionality
  // };
  
  return (
    // <div className="flex h-screen bg-gray-50 overflow-hidden">
    <div className={`${!isDarkMode ?  'flex bg-white text-gray-800' : 'flex bg-gray-900 text-white' } h-screen transition-colors duration-200 overflow-hidden`}>
      {/* Sidebar - Desktop */}
      <Sidebar />
           
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="lg:hidden flex-1 flex justify-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mr-2">
                <span className="text-xl">P</span>
              </div>
              <span className="text-orange-500 font-semibold">Panafric</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-2xl font-semibold text-gray-800">CRM Dashboard</h1>
          </div>

        <div className="flex items-center space-x-4">
          <button 
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src="/api/placeholder/40/40" 
                  alt="User profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:block">Taylor Thompson</span>
              <ChevronDown size={16} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                <a href="#profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
                <a href="#settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
                <a href="#logout" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Sign Out</a>
              </div>
            )}
          </div>
        </div>
        </header>       */}

        <Header/>

        {/* <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
            <img src="/api/placeholder/32/32" alt="Profile" />
          </div>
          <span className="hidden md:block">CyberSoft DEV </span>
        </div>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white"></div>
          </div>
        </button>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <div className="w-6 h-6">
            <div className="w-3 h-3 border-2 border-gray-400 rounded-sm"></div>
          </div>
        </button>
      </div> */}
        
        
        {/* Dashboard Content */}
        {/* <div className="flex-1 p-10 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}> */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
            <Outlet></Outlet>
        </main>
         
      </div>
    </div>
  );
}
