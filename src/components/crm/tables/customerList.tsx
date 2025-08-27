import { useState, useEffect, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';

// type RowData = {
//   id: number;
//   name: string;
//   customerType : string;
//   email: string;
//   telephoneNumber: string;
//   industry: string;
// };

const CustomerList = () => {
  const API_BASE: string = import.meta.env.VITE_API_BASE_URL;
  
  const gridRef = useRef(null);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

   const [columnDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID', 
      sortable: true, 
      filter: true, 
      width: 100 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      field: 'customerType', 
      headerName: 'Type', 
      sortable: true, 
      filter: true, 
      width: 120 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      sortable: true, 
      filter: true, 
      flex: 1 
    },
    { 
      field: 'telephoneNumber', 
      headerName: 'Phone', 
      sortable: true, 
      filter: true, 
      width: 150 
    },
    { 
      field: 'industry', 
      headerName: 'Industry', 
      sortable: true, 
      filter: true, 
      width: 150 
    },
    {
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filter: false,
      cellRenderer: (params: { data: { id: any; }; }) => {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditCustomer(params.data.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
            >
              Edit
            </button>
            <button
              onClick={() => handleViewCustomer(params.data.id)}
              className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
            >
              View
            </button>
          </div>
        );
      }
    }
  ]);

  // Default column definitions
  const defaultColDef = {
    minWidth: 100,
    resizable: true,
  };

// Inside your CustomerList component
const handleEditCustomer = useCallback((customerId: any) => {
  navigate(`/customerform/edit/${customerId}`);
}, [navigate]);
  
const handleViewCustomer = useCallback((customerId: any) => {
  navigate(`/customerform/view/${customerId}`);
}, [navigate]);
  
// Handle create new customer
const handleCreateCustomer = () => {
  navigate('/customerform/new');
};


// Fetch customers
useEffect(() => {
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/core/Customers`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.status}`);
      }
      
      const data = await response.json();
      setRowData(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  fetchCustomers();
}, []);

  
// Handle refresh
const handleRefresh = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch(`${API_BASE}/core/Customers`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }
    
    const data = await response.json();
    setRowData(data);
  } catch (err) {
    console.error('Error refreshing customers:', err);
    setError('Failed to refresh customers. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleCreateCustomer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Customer
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {loading && !error && (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700">Loading customers...</span>
          </div>
        </div>
      )}
      
      {/* AG Grid component */}
      <div className="ag-theme-alpine w-full" style={{ height: 600 }}>
        
         <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="single"
          // rowSelection={{ type: 'multiple' }} 
          pagination={true}
          paginationPageSize={50}
          domLayout='autoHeight'
        />
      </div>
      
      {/* Show a message when no data */}
      {!loading && rowData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg">No customers found</p>
          <p className="mt-2">Click "Add New Customer" to create one</p>
        </div>
      )}
    </div>
  );
};


ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

export default CustomerList;