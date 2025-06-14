// @ts-nocheck

import { Search, Settings, LogOut, Menu, MoreHorizontal, ChevronDown, Filter, X } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {

  const [activeTab, setActiveTab] = useState('Monitored');
  
  return (
    <div >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Shipment Metrics Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="font-semibold text-gray-700 text-lg">Shipment Metrics</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Complete</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Pending dispatch</span>
                </div>
              </div>
              <div className="relative">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium">Last 30 days</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
              </div>
            </div>
            <div className="h-72 relative">
              <ShipmentChart />
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Pending dispatch <span className="font-bold">80</span></div>
                <div className="text-sm text-gray-500">Complete <span className="font-bold">48</span></div>
              </div>
            </div>
          </div>
          
          {/* Active Shipments */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-700 text-lg">Active Shipments</h2>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="flex justify-center items-center mb-8">
              <div className="relative w-48 h-48">
                <div className="w-full h-full rounded-full border-16 border-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold">1.600</div>
                    <div className="text-sm text-gray-500">Shipments</div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-16 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-l-yellow-400 transform -rotate-45"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-4 h-4 bg-yellow-200 mr-3"></div>
                <span className="text-sm font-medium">On-Time: 48%</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-4 h-4 bg-orange-200 mr-3"></div>
                <span className="text-sm font-medium">Running Ahead: 9%</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-4 h-4 bg-yellow-400 mr-3"></div>
                <span className="text-sm font-medium">Running Late: 8%</span>
              </div>
              <div className="flex items-center p-3 rounded-lg bg-gray-50">
                <div className="w-4 h-4 bg-orange-500 mr-3"></div>
                <span className="text-sm font-medium">In-Transit: 35%</span>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow xl:col-span-1">
            <h2 className="font-semibold text-gray-700 text-lg mb-6">Recent Orders</h2>
            <div className="flex flex-col sm:flex-row mb-6 gap-4">
              <div className="flex">
                <button 
                  className={`px-4 py-2 ${activeTab === 'Monitored' ? 'bg-gray-100 font-medium' : 'bg-white'} rounded-l-lg border border-gray-300 hover:bg-gray-50 transition-colors`}
                  onClick={() => setActiveTab('Monitored')}
                >
                  Monitored
                </button>
                <button 
                  className={`px-4 py-2 ${activeTab === 'Unmonitored' ? 'bg-gray-100 font-medium' : 'bg-white'} rounded-r-lg border-t border-r border-b border-gray-300 hover:bg-gray-50 transition-colors`}
                  onClick={() => setActiveTab('Unmonitored')}
                >
                  Unmonitored
                </button>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} className="mr-2" />
                <span className="font-medium">Filters</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Arrival</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4].map((item) => (
                    <tr key={item} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm text-blue-500 font-medium">8f4d43d3-89</td>
                      <td className="py-4 px-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          At Origin
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">Addis Ababa, Ethiopia</td>
                      <td className="py-4 px-4 text-sm">Memphis, Tennessee</td>
                      <td className="py-4 px-4 text-sm">Mar 12, 2025</td>
                      <td className="py-4 px-4">
                        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Order Inventory Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-semibold text-gray-700 text-lg mb-6">Order Inventory Status</h2>
            <div className="h-72 flex items-end justify-around">
              <div className="w-16 h-full flex flex-col justify-end">
                <div className="bg-green-400 w-full rounded-t-lg transition-all hover:brightness-110" style={{ height: '90%' }}></div>
              </div>
              <div className="w-16 h-full flex flex-col justify-end">
                <div className="bg-blue-400 w-full rounded-t-lg transition-all hover:brightness-110" style={{ height: '40%' }}></div>
              </div>
              <div className="w-16 h-full flex flex-col justify-end">
                <div className="bg-orange-400 w-full rounded-t-lg transition-all hover:brightness-110" style={{ height: '65%' }}></div>
              </div>
              <div className="w-1/4 h-full flex flex-col justify-between">
                <div className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-green-400 rounded-sm mr-3"></div>
                  <span className="text-sm font-medium">Available</span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-blue-400 rounded-sm mr-3"></div>
                  <span className="text-sm font-medium">Blocking</span>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-4 h-4 bg-orange-400 rounded-sm mr-3"></div>
                  <span className="text-sm font-medium">Damaged</span>
                </div>
              </div>
            </div>
          </div>
        </div>        
    </div>
  );
}

// Custom components for the sidebar icons
function SidebarItem({ icon, label, active = false, highlight = false, sidebarOpen }) {
  return (
    <div className={`flex items-center p-2 my-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100' : ''}`}>
      <div className={`w-8 h-8 flex items-center justify-center ${highlight ? 'text-orange-500' : 'text-gray-600'}`}>
        {icon}
      </div>
      {sidebarOpen && <span className={`ml-2 ${highlight ? 'text-orange-500' : 'text-gray-600'}`}>{label}</span>}
    </div>
  );
}

function GridIcon() {
  return (
    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
      <div className="bg-current rounded-sm"></div>
      <div className="bg-current rounded-sm"></div>
      <div className="bg-current rounded-sm"></div>
      <div className="bg-current rounded-sm"></div>
    </div>
  );
}

function BoxIcon() {
  return (
    <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
      <div className="w-2 h-2 bg-current"></div>
    </div>
  );
}

function MessageIcon() {
  return (
    <div className="w-5 h-5 relative">
      <div className="absolute inset-0 border-2 border-current rounded"></div>
      <div className="absolute bottom-0 left-0 w-3 h-2 bg-current transform translate-y-1/2 rotate-45"></div>
    </div>
  );
}

function BillingIcon() {
  return (
    <div className="w-5 h-5 border-2 border-current rounded-sm flex flex-col justify-center items-center">
      <div className="w-3 h-0.5 bg-current mb-0.5"></div>
      <div className="w-3 h-0.5 bg-current"></div>
    </div>
  );
}

function TruckIcon() {
  return (
    <div className="w-5 h-5 relative">
      <div className="w-3 h-2 border-2 border-current absolute top-0.5 left-0"></div>
      <div className="w-4 h-2 bg-current absolute bottom-0.5 left-0.5"></div>
      <div className="w-1.5 h-1.5 border border-current rounded-full absolute bottom-0 left-0.5"></div>
      <div className="w-1.5 h-1.5 border border-current rounded-full absolute bottom-0 right-0.5"></div>
    </div>
  );
}

function CRMIcon() {
  return (
    <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
      <div className="w-2 h-0.5 bg-current"></div>
    </div>
  );
}

function ChartIcon() {
  return (
    <div className="w-5 h-5 flex items-end">
      <div className="w-1 h-2 bg-current mr-0.5"></div>
      <div className="w-1 h-4 bg-current mr-0.5"></div>
      <div className="w-1 h-3 bg-current"></div>
    </div>
  );
}

function TerminalIcon() {
  return (
    <div className="w-5 h-5 border-2 border-current rounded-sm flex items-center justify-center">
      <div className="w-3 h-0.5 bg-current"></div>
    </div>
  );
}

function ShipIcon() {
  return (
    <div className="w-5 h-5 relative">
      <div className="w-4 h-2 bg-current absolute bottom-0.5 left-0.5"></div>
      <div className="w-1 h-1.5 bg-current absolute top-0.5 left-2"></div>
    </div>
  );
}

function HelpIcon() {
  return (
    <div className="w-5 h-5 border-2 border-current rounded-full flex items-center justify-center">
      <div className="text-xs font-bold">?</div>
    </div>
  );
}

// Simple placeholder chart component
function ShipmentChart() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 relative">
        {/* Orange line chart */}
        <svg className="absolute inset-0" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(251, 146, 60)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(251, 146, 60)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,150 C50,120 75,140 100,100 L150,130 L200,70 L250,80 L300,45 L350,30 L400,20 L400,200 L0,200 Z" 
                fill="url(#orangeGradient)" />
          <path d="M0,150 C50,120 75,140 100,100 L150,130 L200,70 L250,80 L300,45 L350,30 L400,20" 
                fill="none" stroke="#FB923C" strokeWidth="2" />
                
          {/* Data points */}
          <circle cx="0" cy="150" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="50" cy="120" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="100" cy="100" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="150" cy="130" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="200" cy="70" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="250" cy="80" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="300" cy="45" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="350" cy="30" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
          <circle cx="400" cy="20" r="4" fill="white" stroke="#FB923C" strokeWidth="2" />
        </svg>
        
        {/* Yellow line chart */}
        <svg className="absolute inset-0" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(250, 204, 21)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(250, 204, 21)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M0,160 L50,165 L100,170 L150,165 L200,175 L250,160 L300,170 L350,165 L400,140 L400,200 L0,200 Z" 
                fill="url(#yellowGradient)" />
          <path d="M0,160 L50,165 L100,170 L150,165 L200,175 L250,160 L300,170 L350,165 L400,140" 
                fill="none" stroke="#FACC15" strokeWidth="2" />
                
          {/* Data points */}
          <circle cx="0" cy="160" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="50" cy="165" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="100" cy="170" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="150" cy="165" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="200" cy="175" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="250" cy="160" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="300" cy="170" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="350" cy="165" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
          <circle cx="400" cy="140" r="4" fill="white" stroke="#FACC15" strokeWidth="2" />
        </svg>
      </div>
      <div className="h-6 flex justify-between px-4">
        <span className="text-xs text-gray-500">1</span>
        <span className="text-xs text-gray-500">5</span>
        <span className="text-xs text-gray-500">10</span>
        <span className="text-xs text-gray-500">15</span>
        <span className="text-xs text-gray-500">20</span>
        <span className="text-xs text-gray-500">25</span>
      </div>
    </div>
  );
}