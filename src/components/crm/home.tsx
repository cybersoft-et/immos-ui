import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />        
      </main>
    </div>
  );
}
