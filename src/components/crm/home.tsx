import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      {/* flex-1 p-6 bg-gray-100 ml-64 overflow-y-auto h-screen */}
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        <Outlet />        
      </main>
    </div>
  );
}
