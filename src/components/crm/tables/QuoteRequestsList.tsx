import { useState, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Edit, Trash2, X, Save, RefreshCw, Plus } from 'lucide-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function QuoteRequestsListV2() {

   const API_BASE: string = import.meta.env.VITE_API_BASE_URL;

  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [originalQuotes, setOriginalQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuote, setEditQuote] = useState(null);

  // Fetch data from backend
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/core/Quotations`);
      if (!response.ok) throw new Error('Failed to fetch quotes');
      
      const data = await response.json();
      
      // Store original quotes
      let quotesArray = Array.isArray(data) ? data : [data];
      setOriginalQuotes(quotesArray);
      console.log('Fetched Quotes:', quotesArray);
      
      // Transform the data to flatten for grid display
      let transformedData = quotesArray.map(quote => ({
        // Quote level data
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        createDate: new Date(quote.createDate).toLocaleDateString(),
        createUser: quote.createUser,
        
        // Contact data
        firstName: quote.contact.firstName,
        lastName: quote.contact.lastName,
        fullName: quote.contact.fullName,
        companyName: quote.contact.companyName,
        email: quote.contact.email,
        phone: quote.contact.phone,
        street: quote.contact.address.street,
        houseNumber: quote.contact.address.houseNumber,
        postalCode: quote.contact.address.postalCode,
        zipCode: quote.contact.address.zipCode,
        city: quote.contact.address.city,
        country: quote.contact.address.country,
        
        // Request summary data (from first request or aggregated)
        totalRequests: quote.requests.length,
        requestIds: quote.requests.map(r => r.id).join(', '),
        
        // Get data from first request as representative
        modeOfTransport: quote.requests.length > 0 ? quote.requests[0].modeOfTransport : '',
        serviceMode: quote.requests.length > 0 ? quote.requests[0].serviceMode : '',
        cargoTransportMethod: quote.requests.length > 0 ? quote.requests[0].cargoTransportMethod : '',
        commodityType: quote.requests.length > 0 ? quote.requests[0].commodityType : '',
        routePreference: quote.requests.length > 0 ? quote.requests[0].routePreference : '',
        originCountry: quote.requests.length > 0 ? quote.requests[0].origin.country : '',
        originPlace: quote.requests.length > 0 ? quote.requests[0].origin.place : '',
        dateReadyToPickup: quote.requests.length > 0 ? new Date(quote.requests[0].origin.dateReadyToPickup).toLocaleDateString() : '',
        destinationCountry: quote.requests.length > 0 ? quote.requests[0].destination.country : '',
        destinationPlace: quote.requests.length > 0 ? quote.requests[0].destination.place : '',
        deliveryDate: quote.requests.length > 0 ? new Date(quote.requests[0].destination.deliveryDate).toLocaleDateString() : '',
        weight: quote.requests.length > 0 ? quote.requests[0].grossWeight.weight : 0,
        weightUnit: quote.requests.length > 0 ? quote.requests[0].grossWeight.unit : 'Kilogram',
        length: quote.requests.length > 0 ? quote.requests[0].dimension.length : 0,
        width: quote.requests.length > 0 ? quote.requests[0].dimension.width : 0,
        height: quote.requests.length > 0 ? quote.requests[0].dimension.height : 0,
        commodityDescription: quote.requests.length > 0 ? quote.requests[0].commodityDescription || '' : '',
        additionalInfo: quote.requests.length > 0 ? quote.requests[0].additionalInfo || '' : ''
      }));
      
      setRowData(transformedData);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // alert('Failed to fetch quotes. Using sample data.');
      setRowData([]);
      setOriginalQuotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchQuotes();

    console.log('Original Quotes on Load:', originalQuotes);
    console.log('RowData Quotes on Load:', rowData);

  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    fetchQuotes();
  };

  const ActionsCellRenderer = (props) => {
    return (
      <div className="flex gap-2 h-full items-center">
        <button
          onClick={() => handleEdit(props.data.quoteId)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Edit Quote"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(props.data.quoteId)}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete Quote"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const ModeOfTransportCellRenderer = (props) => {
    const modeColors = {
      'AirFreight': 'bg-blue-100 text-blue-800',
      'OceanFreight': 'bg-cyan-100 text-cyan-800',
      'SeaFreight': 'bg-cyan-100 text-cyan-800',
      'Road': 'bg-green-100 text-green-800',
      'Rail': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${modeColors[props.value] || 'bg-gray-100 text-gray-800'}`}>
        {props.value}
      </span>
    );
  };

  const ServiceModeCellRenderer = (props) => {
    const serviceColors = {
      'Import': 'bg-indigo-100 text-indigo-800',
      'Export': 'bg-orange-100 text-orange-800',
      'Domestic': 'bg-teal-100 text-teal-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${serviceColors[props.value] || 'bg-gray-100 text-gray-800'}`}>
        {props.value}
      </span>
    );
  };

  const columnDefs = useMemo(() => [
    { 
      headerName: 'Quote #', 
      field: 'quoteNumber', 
      width: 120,
      filter: 'agTextColumnFilter',
      sortable: true,
      pinned: 'left'
    },
    { 
      headerName: 'Request ID', 
      field: 'requestId', 
      width: 110,
      filter: 'agNumberColumnFilter',
      sortable: true
    },
    { 
      headerName: 'Full Name', 
      field: 'fullName', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 180
    },
    { 
      headerName: 'Company', 
      field: 'companyName', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150
    },
    { 
      headerName: 'Email', 
      field: 'email', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 220
    },
    { 
      headerName: 'Phone', 
      field: 'phone', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 130
    },
    { 
      headerName: 'City', 
      field: 'city', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 130
    },
    { 
      headerName: 'Country', 
      field: 'country', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 120
    },
    { 
      headerName: 'Transport Mode', 
      field: 'modeOfTransport',
      cellRenderer: ModeOfTransportCellRenderer,
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 140
    },
    { 
      headerName: 'Service Mode', 
      field: 'serviceMode',
      cellRenderer: ServiceModeCellRenderer,
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 130
    },
    { 
      headerName: 'Commodity', 
      field: 'commodityType', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150
    },
    { 
      headerName: 'Route Preference', 
      field: 'routePreference', 
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 150
    },
    { 
      headerName: 'Origin', 
      field: 'originPlace',
      valueGetter: (params) => `${params.data.originPlace}, ${params.data.originCountry}`,
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 200
    },
    { 
      headerName: 'Destination', 
      field: 'destinationPlace',
      valueGetter: (params) => `${params.data.destinationPlace}, ${params.data.destinationCountry}`,
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 200
    },
    { 
      headerName: 'Pickup Date', 
      field: 'dateReadyToPickup',
      filter: 'agDateColumnFilter',
      sortable: true,
      width: 120
    },
    { 
      headerName: 'Delivery Date', 
      field: 'deliveryDate',
      filter: 'agDateColumnFilter',
      sortable: true,
      width: 130
    },
    { 
      headerName: 'Weight', 
      field: 'weight',
      valueGetter: (params) => `${params.data.weight} ${params.data.weightUnit}`,
      filter: 'agNumberColumnFilter',
      sortable: true,
      width: 150
    },
    { 
      headerName: 'Dimensions (L×W×H)', 
      field: 'dimensions',
      valueGetter: (params) => `${params.data.length}×${params.data.width}×${params.data.height}`,
      filter: false,
      sortable: false,
      width: 180
    },
    { 
      headerName: 'Created Date', 
      field: 'createDate',
      filter: 'agDateColumnFilter',
      sortable: true,
      width: 120
    },
    { 
      headerName: 'Created By', 
      field: 'createUser',
      filter: 'agTextColumnFilter',
      sortable: true,
      width: 120
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionsCellRenderer,
      width: 120,
      pinned: 'right',
      sortable: false,
      filter: false
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
  }), []);

  const handleEdit = (quoteId) => {
    console.log('Editing quote before:', quoteId);

    const quote = originalQuotes.find(q => q.id === quoteId);
    console.log('Editing quote before: Check Quote', originalQuotes);

    if (quote) {
      console.log('Editing quote:', quote);
      setEditQuote(JSON.parse(JSON.stringify(quote))); // Deep clone
      setShowEditModal(true);
    }else {
      fetchQuotes();
      // alert('Quote not found. Please refresh the data.');
    }
  };

  const handleDelete = async (quoteId) => {
    if (window.confirm('Are you sure you want to delete this quote and all its requests?')) {
      try {
        // Delete API
        const response = await fetch(`${API_BASE}/core/Quotations/${quoteId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        
        const updatedQuotes = originalQuotes.filter(q => q.id !== quoteId);
        setOriginalQuotes(updatedQuotes);
        setRowData(rowData.filter(row => row.quoteId !== quoteId));
        alert('Quote deleted successfully!');
      } catch (error) {
        console.error('Error deleting quote:', error);
        alert('Failed to delete quote');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Uncomment to use API
      const response = await fetch(`${API_BASE}/core/Quotations/${editQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editQuote)
      });
      if (!response.ok) throw new Error('Failed to update');
      
      const updatedQuotes = originalQuotes.map(q => 
        q.id === editQuote.id ? editQuote : q
      );
      setOriginalQuotes(updatedQuotes);
      
      // Refresh grid data - one row per quote
      const transformedData = updatedQuotes.map(quote => ({
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        createDate: new Date(quote.createDate).toLocaleDateString(),
        createUser: quote.createUser,
        firstName: quote.contact.firstName,
        lastName: quote.contact.lastName,
        fullName: quote.contact.fullName,
        companyName: quote.contact.companyName,
        email: quote.contact.email,
        phone: quote.contact.phone,
        street: quote.contact.address.street,
        houseNumber: quote.contact.address.houseNumber,
        postalCode: quote.contact.address.postalCode,
        zipCode: quote.contact.address.zipCode,
        city: quote.contact.address.city,
        country: quote.contact.address.country,
        totalRequests: quote.requests.length,
        requestIds: quote.requests.map(r => r.id).join(', '),
        modeOfTransport: quote.requests.length > 0 ? quote.requests[0].modeOfTransport : '',
        serviceMode: quote.requests.length > 0 ? quote.requests[0].serviceMode : '',
        cargoTransportMethod: quote.requests.length > 0 ? quote.requests[0].cargoTransportMethod : '',
        commodityType: quote.requests.length > 0 ? quote.requests[0].commodityType : '',
        routePreference: quote.requests.length > 0 ? quote.requests[0].routePreference : '',
        originCountry: quote.requests.length > 0 ? quote.requests[0].origin.country : '',
        originPlace: quote.requests.length > 0 ? quote.requests[0].origin.place : '',
        dateReadyToPickup: quote.requests.length > 0 ? new Date(quote.requests[0].origin.dateReadyToPickup).toLocaleDateString() : '',
        destinationCountry: quote.requests.length > 0 ? quote.requests[0].destination.country : '',
        destinationPlace: quote.requests.length > 0 ? quote.requests[0].destination.place : '',
        deliveryDate: quote.requests.length > 0 ? new Date(quote.requests[0].destination.deliveryDate).toLocaleDateString() : '',
        weight: quote.requests.length > 0 ? quote.requests[0].grossWeight.weight : 0,
        weightUnit: quote.requests.length > 0 ? quote.requests[0].grossWeight.unit : 'Kilogram',
        length: quote.requests.length > 0 ? quote.requests[0].dimension.length : 0,
        width: quote.requests.length > 0 ? quote.requests[0].dimension.width : 0,
        height: quote.requests.length > 0 ? quote.requests[0].dimension.height : 0,
        commodityDescription: quote.requests.length > 0 ? quote.requests[0].commodityDescription || '' : '',
        additionalInfo: quote.requests.length > 0 ? quote.requests[0].additionalInfo || '' : ''
      }));
      
      setRowData(transformedData);
      console.log('Updated quote:', editQuote);
      setShowEditModal(false);
      setEditQuote(null);
      alert('Quote updated successfully!');
    } catch (error) {
      console.error('Error updating quote:', error);
      alert('Failed to update quote');
    }
  };

  

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditQuote(null);
  };

  const updateContact = (field, value) => {
    setEditQuote({
      ...editQuote,
      contact: { ...editQuote.contact, [field]: value }
    });
  };

  const updateContactAddress = (field, value) => {
    setEditQuote({
      ...editQuote,
      contact: {
        ...editQuote.contact,
        address: { ...editQuote.contact.address, [field]: value }
      }
    });
  };

  const updateRequest = (index, field, value) => {
    const updatedRequests = [...editQuote.requests];
    updatedRequests[index] = { ...updatedRequests[index], [field]: value };
    setEditQuote({ ...editQuote, requests: updatedRequests });
  };

  const updateRequestNested = (index, parent, field, value) => {
    const updatedRequests = [...editQuote.requests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [parent]: { ...updatedRequests[index][parent], [field]: value }
    };
    setEditQuote({ ...editQuote, requests: updatedRequests });
  };

  const addRequest = () => {
    const newRequest = {
      id: Math.max(...editQuote.requests.map(r => r.id), 0) + 1,
      quotationId: editQuote.id,
      modeOfTransport: "AirFreight",
      serviceMode: "Export",
      cargoTransportMethod: "",
      routePreference: "None",
      customRoutePreference: "",
      commodityType: "NonDangerous",
      description: "",
      origin: {
        country: "",
        place: "",
        dateReadyToPickup: new Date().toISOString()
      },
      destination: {
        country: "",
        place: "",
        deliveryDate: new Date().toISOString()
      },
      grossWeight: {
        weight: 0,
        unit: "Kilogram"
      },
      dimension: {
        length: 0,
        width: 0,
        height: 0
      },
      additionalServices: [],
      additionalInfo: "",
      commodityDescription: "",
      createDate: new Date().toISOString(),
      createUser: editQuote.createUser
    };
    
    setEditQuote({
      ...editQuote,
      requests: [...editQuote.requests, newRequest]
    });
  };

  const removeRequest = (index) => {
    if (editQuote.requests.length > 1) {
      const updatedRequests = editQuote.requests.filter((_, i) => i !== index);
      setEditQuote({ ...editQuote, requests: updatedRequests });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-600">Quote Requests V2</h1>
            <p className="text-gray-600 mt-2">Manage and view all quote requests</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">        

          <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={20}
              animateRows={true}
              rowSelection="single"
              loading={loading}
            />
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-800">Edit Quote - {editQuote.quoteNumber}</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Contact Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editQuote.contact.firstName}
                        onChange={(e) => updateContact('firstName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editQuote.contact.lastName}
                        onChange={(e) => updateContact('lastName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={editQuote.contact.companyName}
                        onChange={(e) => updateContact('companyName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editQuote.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editQuote.contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.street}
                        onChange={(e) => updateContactAddress('street', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.houseNumber}
                        onChange={(e) => updateContactAddress('houseNumber', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.postalCode}
                        onChange={(e) => updateContactAddress('postalCode', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.zipCode}
                        onChange={(e) => updateContactAddress('zipCode', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.city}
                        onChange={(e) => updateContactAddress('city', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={editQuote.contact.address.country}
                        onChange={(e) => updateContactAddress('country', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipment Requests */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Shipment Requests ({editQuote.requests.length})</h3>
                    <button
                      onClick={addRequest}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Request
                    </button>
                  </div>

                  {editQuote.requests.map((request, index) => (
                    <div key={request.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-700">Request #{index + 1} (ID: {request.id})</h4>
                        {editQuote.requests.length > 1 && (
                          <button
                            onClick={() => removeRequest(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Transport</label>
                          <select
                            value={request.modeOfTransport}
                            onChange={(e) => updateRequest(index, 'modeOfTransport', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="AirFreight">Air Freight</option>
                            <option value="OceanFreight">Ocean Freight</option>
                            <option value="SeaFreight">Sea Freight</option>
                            <option value="Road">Road</option>
                            <option value="Rail">Rail</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service Mode</label>
                          <select
                            value={request.serviceMode}
                            onChange={(e) => updateRequest(index, 'serviceMode', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="Import">Import</option>
                            <option value="Export">Export</option>
                            <option value="Domestic">Domestic</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Transport Method</label>
                          <input
                            type="text"
                            value={request.cargoTransportMethod}
                            onChange={(e) => updateRequest(index, 'cargoTransportMethod', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Commodity Type</label>
                          <select
                            value={request.commodityType}
                            onChange={(e) => updateRequest(index, 'commodityType', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="NonDangerous">Non-Dangerous</option>
                            <option value="Dangerous">Dangerous</option>
                            <option value="Fragile">Fragile</option>
                            <option value="Perishable">Perishable</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Route Preference</label>
                          <select
                            value={request.routePreference}
                            onChange={(e) => updateRequest(index, 'routePreference', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="None">None</option>
                            <option value="Fastest">Fastest</option>
                            <option value="Cheapest">Cheapest</option>
                            <option value="Custom">Custom</option>
                          </select>
                        </div>
                      </div>

                      {/* Origin */}
                      <div className="bg-white p-4 rounded mb-4">
                        <h5 className="font-semibold mb-3 text-sm text-gray-700">Origin</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                              type="text"
                              value={request.origin.country}
                              onChange={(e) => updateRequestNested(index, 'origin', 'country', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                            <input
                              type="text"
                              value={request.origin.place}
                              onChange={(e) => updateRequestNested(index, 'origin', 'place', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ready to Pickup Date</label>
                            <input
                              type="date"
                              value={request.origin.dateReadyToPickup ? request.origin.dateReadyToPickup.split('T')[0] : ''}
                              onChange={(e) => updateRequestNested(index, 'origin', 'dateReadyToPickup', e.target.value + 'T00:00:00')}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="bg-white p-4 rounded mb-4">
                        <h5 className="font-semibold mb-3 text-sm text-gray-700">Destination</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                              type="text"
                              value={request.destination.country}
                              onChange={(e) => updateRequestNested(index, 'destination', 'country', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                            <input
                              type="text"
                              value={request.destination.place}
                              onChange={(e) => updateRequestNested(index, 'destination', 'place', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                            <input
                              type="date"
                              value={request.destination.deliveryDate ? request.destination.deliveryDate.split('T')[0] : ''}
                              onChange={(e) => updateRequestNested(index, 'destination', 'deliveryDate', e.target.value + 'T00:00:00')}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Weight and Dimensions */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                            <input
                              type="number"
                              value={request.grossWeight.weight}
                              onChange={(e) => updateRequestNested(index, 'grossWeight', 'weight', parseFloat(e.target.value) || 0)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select
                              value={request.grossWeight.unit}
                              onChange={(e) => updateRequestNested(index, 'grossWeight', 'unit', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option value="Kilogram">Kilogram</option>
                              <option value="Pound">Pound</option>
                              <option value="Ton">Ton</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                            <input
                              type="number"
                              value={request.dimension.length}
                              onChange={(e) => updateRequestNested(index, 'dimension', 'length', parseFloat(e.target.value) || 0)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                            <input
                              type="number"
                              value={request.dimension.width}
                              onChange={(e) => updateRequestNested(index, 'dimension', 'width', parseFloat(e.target.value) || 0)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                            <input
                              type="number"
                              value={request.dimension.height}
                              onChange={(e) => updateRequestNested(index, 'dimension', 'height', parseFloat(e.target.value) || 0)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Commodity Description</label>
                          <textarea
                            value={request.commodityDescription}
                            onChange={(e) => updateRequest(index, 'commodityDescription', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
                          <textarea
                            value={request.additionalInfo}
                            onChange={(e) => updateRequest(index, 'additionalInfo', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}