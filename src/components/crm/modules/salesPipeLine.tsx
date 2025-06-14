import React, { useState } from 'react';
import { 
  ChevronDown, 
  Filter, 
  Search, 
  MoreVertical, 
  PieChart, 
  BarChart3, 
  Calendar, 
  Users, 
  DollarSign,
  X
} from 'lucide-react';

const SalesPipeline = () => {
  // Sample data for the pipeline
  const initialStages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-500', deals: 12, value: 35600 },
    { id: 'qualified', name: 'Qualified', color: 'bg-yellow-500', deals: 8, value: 64000 },
    { id: 'proposal', name: 'Proposal', color: 'bg-orange-500', deals: 5, value: 48000 },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-red-500', deals: 3, value: 86000 },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-500', deals: 6, value: 120000 },
  ];

  const initialDeals = [
    { id: '8f4d43d3-89', name: 'Enterprise Software Solution', company: 'Acme Corp', stage: 'lead', value: 12000, closingDate: 'Apr 25, 2025', probability: 20 },
    { id: '7e5c32b2-45', name: 'Cloud Migration Project', company: 'TechGlobal', stage: 'qualified', value: 34000, closingDate: 'May 5, 2025', probability: 50 },
    { id: '6d4b21a1-23', name: 'Data Analytics Package', company: 'DataFlow Inc', stage: 'proposal', value: 28000, closingDate: 'Apr 30, 2025', probability: 65 },
    { id: '5c3a10b0-12', name: 'Security Infrastructure', company: 'SecureNet', stage: 'negotiation', value: 56000, closingDate: 'Apr 15, 2025', probability: 80 },
    { id: '4b2a09c9-78', name: 'CRM Implementation', company: 'RetailGiant', stage: 'closed', value: 45000, closingDate: 'Apr 10, 2025', probability: 100 },
    { id: '3a1b98d8-67', name: 'Networking Hardware', company: 'TechSolutions', stage: 'lead', value: 23600, closingDate: 'May 20, 2025', probability: 30 },
    { id: '2b0a87e7-56', name: 'AI Integration Project', company: 'SmartSystems', stage: 'qualified', value: 30000, closingDate: 'May 15, 2025', probability: 45 },
    { id: '1a0b76f6-45', name: 'Digital Transformation', company: 'OldGuard Inc', stage: 'proposal', value: 20000, closingDate: 'May 10, 2025', probability: 60 },
    { id: '0b9c65e5-34', name: 'Mobile App Development', company: 'MobileFirst', stage: 'negotiation', value: 30000, closingDate: 'Apr 20, 2025', probability: 75 },
    { id: '9c8d54f4-23', name: 'Consulting Services', company: 'ConsultCo', stage: 'closed', value: 75000, closingDate: 'Apr 5, 2025', probability: 100 },
  ];

  // State for pipeline and deals data
  const [stages, setStages] = useState(initialStages);
  const [deals, setDeals] = useState(initialDeals);
  const [activeTab, setActiveTab] = useState('all');
  const [timeFilter, setTimeFilter] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');

  // State for handling deal actions
  const [showForm, setShowForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState([]);
  const [newDeal, setNewDeal] = useState({
    name: '',
    company: '',
    stage: 'lead',
    value: '',
    closingDate: '',
    probability: 20
  });
  
  // State for table actions
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);

//   const [stages, setStages] = useState(initialStages);
//   const [deals, setDeals] = useState(initialDeals);
//   const [activeTab, setActiveTab] = useState('all');
//   const [timeFilter, setTimeFilter] = useState('Last 30 days');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [newDeal, setNewDeal] = useState({
//     name: '',
//     company: '',
//     stage: 'lead',
//     value: '',
//     closingDate: '',
//     probability: 20
//   });

  // Filter deals based on search query and active tab
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        deal.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || deal.stage === activeTab;
    return matchesSearch && matchesTab;
  });

  // Calculate total pipeline value
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  
  // Calculate conversion rate (simplified example - closed deals / all deals)
  const closedDeals = deals.filter(deal => deal.stage === 'closed').length;
  const conversionRate = Math.round((closedDeals / deals.length) * 100);

  // Handle adding a new deal
  const handleAddDeal = () => {
    if (isEditing && selectedDeal && !selectedDeal.isBulk) {
      // Update existing deal
      setDeals(deals.map(deal => {
        if (deal.id === selectedDeal.id) {
          // If stage has changed, update stage counts
          if (deal.stage !== newDeal.stage) {
            // Update stage counts
            setStages(stages.map(stage => {
              if (stage.id === deal.stage) {
                return {
                  ...stage,
                  deals: stage.deals - 1,
                  value: stage.value - (deal.value || 0)
                };
              }
              if (stage.id === newDeal.stage) {
                return {
                  ...stage,
                  deals: stage.deals + 1,
                  value: stage.value + parseInt(newDeal.value || 0)
                };
              }
              return stage;
            }));
          } else if (parseInt(newDeal.value || 0) !== deal.value) {
            // If only value has changed, update stage value
            setStages(stages.map(stage => {
              if (stage.id === deal.stage) {
                return {
                  ...stage,
                  value: stage.value - (deal.value || 0) + parseInt(newDeal.value || 0)
                };
              }
              return stage;
            }));
          }
          
          // Return the updated deal
          return {
            ...deal,
            ...newDeal,
            value: parseInt(newDeal.value || 0)
          };
        }
        return deal;
      }));
      
      setIsEditing(false);
      setSelectedDeal(null);
    } else {
      // Add new deal
      const dealToAdd = {
        ...newDeal,
        value: parseInt(newDeal.value || 0),
        id: Math.random().toString(36).substring(2, 15),
      };
      
      setDeals([...deals, dealToAdd]);
      
      // Update the count and value in the corresponding stage
      setStages(stages.map(stage => {
        if (stage.id === dealToAdd.stage) {
          return {
            ...stage,
            deals: stage.deals + 1,
            value: stage.value + dealToAdd.value
          };
        }
        return stage;
      }));
    }
    
    // Reset form
    setNewDeal({
      name: '',
      company: '',
      stage: 'lead',
      value: '',
      closingDate: '',
      probability: 20
    });
    setShowForm(false);
  };

  // Handle deal editing
  const handleEditDeal = (deal) => {
    setIsEditing(true);
    setSelectedDeal(deal);
    setNewDeal({
      name: deal.name,
      company: deal.company,
      stage: deal.stage,
      value: deal.value.toString(),
      closingDate: deal.closingDate,
      probability: deal.probability
    });
    setShowForm(true);
  };

  // Handle deal deletion
  const handleDeleteDeal = (deal) => {
    // Set selected deal and show deletion modal
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  };

  // Confirm deal deletion
  const confirmDeleteDeal = () => {
    if (selectedDeal) {
      // Update stage counts and values
      setStages(stages.map(stage => {
        if (stage.id === selectedDeal.stage) {
          return {
            ...stage,
            deals: stage.deals - 1,
            value: stage.value - selectedDeal.value
          };
        }
        return stage;
      }));
      
      // Remove the deal
      setDeals(deals.filter(deal => deal.id !== selectedDeal.id));
      setShowDeleteModal(false);
      setSelectedDeal(null);
    }
  };

  // View deal details
  const handleViewDetails = (deal) => {
    // Set selected deal and show details modal
    setSelectedDeal(deal);
    setShowDetailsModal(true);
  };

  // Handle moving a deal to a different stage
  const handleMoveStage = (dealId, newStage) => {
    const dealToMove = deals.find(deal => deal.id === dealId);
    const oldStage = dealToMove.stage;
    
    // Update the deal
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        return {
          ...deal,
          stage: newStage,
          probability: stages.find(s => s.id === newStage)?.id === 'closed' ? 100 : deal.probability
        };
      }
      return deal;
    }));
    
    // Update the counts and values in the stages
    setStages(stages.map(stage => {
      if (stage.id === oldStage) {
        return {
          ...stage,
          deals: stage.deals - 1,
          value: stage.value - dealToMove.value
        };
      }
      if (stage.id === newStage) {
        return {
          ...stage,
          deals: stage.deals + 1,
          value: stage.value + dealToMove.value
        };
      }
      return stage;
    }));
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex flex-col h-full w-full text-gray-800 ">
      {/* Header */}
      <div className="flex justify-between items-center p-4 md:p-6 bg-white border-b shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Sales Pipeline</h1>
          <p className="text-gray-500 text-sm">Track and manage your deals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <button
              className="px-4 py-2 bg-white border rounded-md flex items-center gap-2 hover:bg-gray-50"
              onClick={() => {}}
            >
              <Calendar size={16} />
              {timeFilter}
              <ChevronDown size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Deal
          </button>
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
              TT
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Pipeline Value</p>
              <h2 className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +12% from last month
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Deals</p>
              <h2 className="text-2xl font-bold">{deals.length}</h2>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <BarChart3 size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +5 new this month
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Conversion Rate</p>
              <h2 className="text-2xl font-bold">{conversionRate}%</h2>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <PieChart size={20} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +3% from last month
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm">Companies</p>
              <h2 className="text-2xl font-bold">{new Set(deals.map(deal => deal.company)).size}</h2>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2 text-sm text-green-600">
            +2 new this month
          </div>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="mx-4 md:mx-6 mb-6 bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Pipeline Stages</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {stages.map((stage) => (
              <div 
                key={stage.id} 
                className="flex-1 border rounded-lg overflow-hidden"
                onClick={() => setActiveTab(stage.id)}
              >
                <div className={`${stage.color} h-2 w-full`}></div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{stage.name}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{stage.deals}</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{formatCurrency(stage.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="flex-1 mx-4 md:mx-6 mb-6 bg-white rounded-lg shadow border">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('all')}
            >
              All Deals
            </button>
            {stages.map((stage) => (
              <button 
                key={stage.id}
                className={`px-3 py-1 rounded hidden md:block ${activeTab === stage.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveTab(stage.id)}
              >
                {stage.name}
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:flex-initial">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search deals..."
                className="pl-9 pr-4 py-2 border rounded-md w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="p-2 border rounded-md hover:bg-gray-50 relative"
              onClick={() => setShowBulkActionMenu(!showBulkActionMenu)}
              disabled={selectedDeals.length === 0}
            >
              <Filter size={18} className={selectedDeals.length === 0 ? "text-gray-400" : "text-blue-600"} />
              
              {/* Bulk Action Menu */}
              {showBulkActionMenu && selectedDeals.length > 0 && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
                      {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
                    </div>
                    <div className="p-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Move to Stage</label>
                      <select
                        className="w-full p-1 text-sm border rounded"
                        onChange={(e) => handleBulkStageChange(e.target.value)}
                      >
                        <option value="">Select...</option>
                        {stages.map((stage) => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={handleBulkDelete}
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      onChange={(e) => {
                        // Select or deselect all deals
                        if (e.target.checked) {
                          setSelectedDeals(filteredDeals.map(deal => deal.id));
                        } else {
                          setSelectedDeals([]);
                        }
                      }}
                      checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th> */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closing Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className={`hover:bg-gray-50 ${selectedDeals.includes(deal.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedDeals.includes(deal.id)}
                      onChange={() => {
                        if (selectedDeals.includes(deal.id)) {
                          setSelectedDeals(selectedDeals.filter(id => id !== deal.id));
                        } else {
                          setSelectedDeals([...selectedDeals, deal.id]);
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={deal.stage}
                      onChange={(e) => handleMoveStage(deal.id, e.target.value)}
                    >
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deal.company}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(deal.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deal.closingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{deal.probability}%</div>
                      </div>
                      <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${deal.probability}%` }} 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            deal.probability < 30 ? 'bg-red-500' :
                            deal.probability < 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors" 
                        onClick={() => handleViewDetails(deal)}
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-100 transition-colors" 
                        onClick={() => handleEditDeal(deal)}
                        title="Edit Deal"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors" 
                        onClick={() => handleDeleteDeal(deal)}
                        title="Delete Deal"
                      >
                      </button>
                      </div>
                      </td>
                    {/* <div className="relative group">
                      <button className="text-gray-500 hover:text-gray-700">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                        <div className="py-1">
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleEditDeal(deal)}
                          >
                            Edit Deal
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleViewDetails(deal)}
                          >
                            View Details
                          </button>
                          <button 
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            onClick={() => handleDeleteDeal(deal)}
                          >
                            Delete Deal
                          </button>
                        </div>
                      </div>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDeals.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No deals found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      
      {/* Add/Edit Deal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{isEditing ? 'Edit Deal' : 'Add New Deal'}</h3>
              <button onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setSelectedDeal(null);
                setNewDeal({
                  name: '',
                  company: '',
                  stage: 'lead',
                  value: '',
                  closingDate: '',
                  probability: 20
                });
              }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deal Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newDeal.stage}
                  onChange={(e) => setNewDeal({...newDeal, stage: e.target.value})}
                >
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({...newDeal, value: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
                <input
                  type="text"
                  placeholder="Apr 30, 2025"
                  className="w-full p-2 border rounded"
                  value={newDeal.closingDate}
                  onChange={(e) => setNewDeal({...newDeal, closingDate: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Probability: {newDeal.probability}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full"
                  value={newDeal.probability}
                  onChange={(e) => setNewDeal({...newDeal, probability: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button 
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setSelectedDeal(null);
                  setNewDeal({
                    name: '',
                    company: '',
                    stage: 'lead',
                    value: '',
                    closingDate: '',
                    probability: 20
                  });
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDeal}
                disabled={!newDeal.name || !newDeal.company}
                className={`px-4 py-2 rounded text-white ${
                  !newDeal.name || !newDeal.company 
                    ? 'bg-blue-300' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Add Deal'}
              </button>
            </div>
            </div>
        </div>
        )}

      {/* Deal Details Modal */}
      {showDetailsModal && selectedDeal && !selectedDeal.isBulk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Deal Details</h3>
              <button onClick={() => {
                setShowDetailsModal(false);
                setSelectedDeal(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">{selectedDeal.name}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{selectedDeal.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stage</p>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          stages.find(s => s.id === selectedDeal.stage)?.color
                        }`}></div>
                        <p className="font-medium">
                          {stages.find(s => s.id === selectedDeal.stage)?.name}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deal Value</p>
                      <p className="font-medium text-lg text-green-600">
                        {formatCurrency(selectedDeal.value)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Closing Date</p>
                      <p className="font-medium">{selectedDeal.closingDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Probability</p>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{selectedDeal.probability}%</div>
                        </div>
                        <div className="overflow-hidden h-2 mt-1 text-xs flex rounded bg-gray-200">
                          <div 
                            style={{ width: `${selectedDeal.probability}%` }} 
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              selectedDeal.probability < 30 ? 'bg-red-500' :
                              selectedDeal.probability < 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-500">Additional Information</p>
                      <p className="text-gray-700">
                        This deal was created on {selectedDeal.closingDate.split(', ')[0]} and is expected to close by {selectedDeal.closingDate}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t pt-4">
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEditDeal(selectedDeal);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Deal
                  </button>
                  <button 
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDeleteDeal(selectedDeal);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Deal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-red-600">
                {selectedDeal.isBulk ? 'Delete Multiple Deals' : 'Delete Deal'}
              </h3>
              <button onClick={() => {
                setShowDeleteModal(false);
                setSelectedDeal(null);
              }} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {selectedDeal.isBulk ? (
                <p className="mb-4">
                  Are you sure you want to delete <span className="font-medium">{selectedDeal.count}</span> deals?
                </p>
              ) : (
                <p className="mb-4">
                  Are you sure you want to delete the deal <span className="font-medium">{selectedDeal.name || 'Selected'}</span>
                  {selectedDeal.company && ` with ${selectedDeal.company}`}?
                </p>
              )}
              <p className="mb-4 text-gray-600">
                This action cannot be undone. This will permanently delete {selectedDeal.isBulk ? 'these deals' : 'this deal'} and all associated data.
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDeal(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteDeal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  {selectedDeal.isBulk ? `Delete ${selectedDeal.count} Deals` : 'Delete Deal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPipeline;