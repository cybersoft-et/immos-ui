import { useState, useMemo } from 'react';
import { MessageSquare, X, Plus, Upload, Trash2, Save } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function QuoteRequestFormV3() {
      const API_BASE: string = import.meta.env.VITE_API_BASE_URL;

  const [requests, setRequests] = useState([
    {
      id: 1,
      modeOfTransport: 'Unknown',
      serviceMode: 'Import',
      cargoTransportMethod: '',
      commodityType: 'Dangerous',
      routePreference: 'None',
      customRoutePreference: '',
      description: '',
      origin: {
        country: '',
        place: '',
        dateReadyToPickup: ''
      },
      destination: {
        country: '',
        place: '',
        deliveryDate: ''
      },
      grossWeight: {
        weight: 0,
        unit: 'Kilogram'
      },
      dimension: {
        length: 0,
        width: 0,
        height: 0
      },
      additionalServices: [],
      additionalInfo: '',
      commodityDescription: ''
    }
  ]);
  
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      houseNumber: '',
      postalCode: '',
      zipCode: '',
      country: '',
      city: ''
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    name: '',
    description: '',
    documentTypeIdOrName: '',
    content: null,
    fileName: '',
    fileSize: 0,
    fileType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRequest = () => {
    const newId = Math.max(...requests.map(r => r.id), 0) + 1;
    setRequests([...requests, {
      id: newId,
      modeOfTransport: 'Unknown',
      serviceMode: 'Import',
      cargoTransportMethod: '',
      commodityType: 'Dangerous',
      routePreference: 'None',
      customRoutePreference: '',
      description: '',
      origin: {
        country: '',
        place: '',
        dateReadyToPickup: ''
      },
      destination: {
        country: '',
        place: '',
        deliveryDate: ''
      },
      grossWeight: {
        weight: 0,
        unit: 'Kilogram'
      },
      dimension: {
        length: 0,
        width: 0,
        height: 0
      },
      additionalServices: [],
      additionalInfo: '',
      commodityDescription: ''
    }]);
  };

  const removeRequest = (id) => {
    if (requests.length > 1) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  const updateRequest = (id, field, value) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const updateRequestNested = (id, parent, field, value) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, [parent]: { ...r[parent], [field]: value } } : r
    ));
  };

  const updateContact = (field, value) => {
    setContact({ ...contact, [field]: value });
  };

  const updateContactAddress = (field, value) => {
    setContact({ 
      ...contact, 
      address: { ...contact.address, [field]: value } 
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentDocument({
        ...currentDocument,
        content: file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        name: file.name // Auto-fill name with filename
      });
    }
  };

  const handleAddDocument = () => {
    if (!currentDocument.content || !currentDocument.name) {
      alert('Please select a file and provide a name');
      return;
    }

    const newDocument = {
      id: Date.now(),
      name: currentDocument.name,
      description: currentDocument.description,
      documentTypeIdOrName: currentDocument.documentTypeIdOrName,
      content: currentDocument.content,
      fileName: currentDocument.fileName,
      fileSize: currentDocument.fileSize,
      fileType: currentDocument.fileType
    };

    setUploadedFiles([...uploadedFiles, newDocument]);
    
    // Reset dialog
    setCurrentDocument({
      name: '',
      description: '',
      documentTypeIdOrName: '',
      content: null,
      fileName: '',
      fileSize: 0,
      fileType: ''
    });
    setShowDocumentDialog(false);
  };

  const removeFile = (id) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // AG-Grid Delete Button Renderer
  const DeleteButtonRenderer = (props) => {
    return (
      <button
        onClick={() => removeFile(props.data.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Remove file"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  };

  // AG-Grid Column Definitions
  const fileColumnDefs = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Document Type',
      field: 'documentTypeIdOrName',
      flex: 1,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'File Name',
      field: 'fileName',
      flex: 2,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'File Type',
      field: 'fileType',
      flex: 1,
      sortable: true,
      filter: 'agTextColumnFilter'
    },
    {
      headerName: 'Size',
      field: 'fileSize',
      flex: 1,
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => formatFileSize(params.value)
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: DeleteButtonRenderer,
      width: 100,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    minWidth: 100
  }), []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Step 1: Create the quote payload without attachments
    const quotePayload = {
      contact: {
        ...contact
      },
      requests: requests.map(({ id, ...rest }) => ({
        ...rest,
        origin: {
          ...rest.origin,
          dateReadyToPickup: rest.origin.dateReadyToPickup ? new Date(rest.origin.dateReadyToPickup).toISOString() : new Date().toISOString()
        },
        destination: {
          ...rest.destination,
          deliveryDate: rest.destination.deliveryDate ? new Date(rest.destination.deliveryDate).toISOString() : new Date().toISOString()
        }
      })),
      attachments: [] // Empty for first request
    };

    console.log('Step 1 - Quote Payload:', JSON.stringify(quotePayload, null, 2));

    try {
      // Step 1: Submit quote request
      const quoteResponse = await fetch(`${API_BASE}/core/Quotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotePayload)
      });

      if (!quoteResponse.ok) throw new Error('Failed to create quote');

      const quoteData = await quoteResponse.json();
      const quotationId = quoteData.quoteNumber;

      console.log('Step 1 - Response:', quoteData);
      console.log('Quotation ID:', quotationId);

      // Step 2: Upload documents if any
      if (uploadedFiles.length > 0 && quotationId) {
        console.log('Step 2 - Uploading documents...');

        for (const file of uploadedFiles) {
          const formData = new FormData();
          formData.append('quotationId', quotationId);
          formData.append('name', file.name);
          formData.append('description', file.description);
          formData.append('documentTypeIdOrName', file.documentTypeIdOrName);
          formData.append('content', file.content);

          console.log('Uploading document:', {
            quotationId,
            name: file.name,
            description: file.description,
            documentTypeIdOrName: file.documentTypeIdOrName,
            fileName: file.fileName
          });

          const uploadResponse = await fetch(`${API_BASE}/core/Quotations/${quotationId}/attachment`, {
            method: 'PUT',
            body: formData
          });

          if (!uploadResponse.ok) {
            console.error(`Failed to upload document: ${file.name}`);
            throw new Error(`Failed to upload document: ${file.name}`);
          }

          const uploadData = await uploadResponse.json();
          console.log('Document uploaded:', uploadData);
        }

        alert(`Quote created successfully with ID: ${quotationId}. All ${uploadedFiles.length} document(s) uploaded!`);
      } else {
        alert(`Quote created successfully with ID: ${quotationId}. No documents to upload.`);
      }

      // Reset form after successful submission
      // Optionally reset the form here

    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote request: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Request A Quote</h1>
        
        {/* Contact Person Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Contact person</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
              <input
                type="text"
                value={contact.firstName}
                onChange={(e) => updateContact('firstName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
              <input
                type="text"
                value={contact.lastName}
                onChange={(e) => updateContact('lastName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input
                type="text"
                value={contact.companyName}
                onChange={(e) => updateContact('companyName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MessageSquare className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                value={contact.address.street}
                onChange={(e) => updateContactAddress('street', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">House number</label>
              <input
                type="text"
                value={contact.address.houseNumber}
                onChange={(e) => updateContactAddress('houseNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
              <input
                type="text"
                value={contact.address.postalCode}
                onChange={(e) => updateContactAddress('postalCode', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP code</label>
              <input
                type="text"
                value={contact.address.zipCode}
                onChange={(e) => updateContactAddress('zipCode', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={contact.address.city}
                onChange={(e) => updateContactAddress('city', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={contact.address.country}
                onChange={(e) => updateContactAddress('country', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shipment Requests</h2>
          
          {requests.map((request, index) => (
            <div key={request.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode of transport</label>
                  <select
                    value={request.modeOfTransport}
                    onChange={(e) => updateRequest(request.id, 'modeOfTransport', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="AirFreight">Air Freight</option>
                    <option value="OceanFreight">Ocean Freight</option>
                    <option value="RoadFreight">Road Freight</option>
                    <option value="RailFreight">Rail Freight</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service mode</label>
                  <select
                    value={request.serviceMode}
                    onChange={(e) => updateRequest(request.id, 'serviceMode', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Import">Import</option>
                    <option value="Export">Export</option>
                    <option value="Domestic">Domestic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo transport method</label>
                  <input
                    type="text"
                    value={request.cargoTransportMethod}
                    onChange={(e) => updateRequest(request.id, 'cargoTransportMethod', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commodity type</label>
                  <select
                    value={request.commodityType}
                    onChange={(e) => updateRequest(request.id, 'commodityType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Dangerous">Dangerous Goods</option>
                    <option value="NonDangerous">Non-Dangerous</option>
                    <option value="General Cargo">General Cargo</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Perishable">Perishable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route preference</label>
                  <select
                    value={request.routePreference}
                    onChange={(e) => updateRequest(request.id, 'routePreference', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="None">No preference</option>
                    <option value="Fastest">Fastest route</option>
                    <option value="Cheapest">Cheapest route</option>
                    <option value="Custom">Custom route</option>
                  </select>
                </div>

                {request.routePreference === 'Custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom route preference</label>
                    <input
                      type="text"
                      value={request.customRoutePreference}
                      onChange={(e) => updateRequest(request.id, 'customRoutePreference', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commodity description</label>
                  <textarea
                    value={request.commodityDescription}
                    onChange={(e) => updateRequest(request.id, 'commodityDescription', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional information</label>
                  <textarea
                    value={request.additionalInfo}
                    onChange={(e) => updateRequest(request.id, 'additionalInfo', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Origin */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Origin</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={request.origin.country}
                      onChange={(e) => updateRequestNested(request.id, 'origin', 'country', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                    <input
                      type="text"
                      value={request.origin.place}
                      onChange={(e) => updateRequestNested(request.id, 'origin', 'place', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ready to pickup date</label>
                    <input
                      type="date"
                      value={request.origin.dateReadyToPickup}
                      onChange={(e) => updateRequestNested(request.id, 'origin', 'dateReadyToPickup', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Destination</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={request.destination.country}
                      onChange={(e) => updateRequestNested(request.id, 'destination', 'country', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                    <input
                      type="text"
                      value={request.destination.place}
                      onChange={(e) => updateRequestNested(request.id, 'destination', 'place', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery date</label>
                    <input
                      type="date"
                      value={request.destination.deliveryDate}
                      onChange={(e) => updateRequestNested(request.id, 'destination', 'deliveryDate', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Weight and Dimensions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross weight</label>
                    <input
                      type="number"
                      value={request.grossWeight.weight}
                      onChange={(e) => updateRequestNested(request.id, 'grossWeight', 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      value={request.grossWeight.unit}
                      onChange={(e) => updateRequestNested(request.id, 'grossWeight', 'unit', e.target.value)}
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
                      onChange={(e) => updateRequestNested(request.id, 'dimension', 'length', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      value={request.dimension.width}
                      onChange={(e) => updateRequestNested(request.id, 'dimension', 'width', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      value={request.dimension.height}
                      onChange={(e) => updateRequestNested(request.id, 'dimension', 'height', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {requests.length > 1 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => removeRequest(request.id)}
                    className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm"
                  >
                    Remove this request | <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addRequest}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mt-4"
          >
            <Plus className="w-5 h-5 border-2 border-current rounded-full" />
            Add another request
          </button>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Attachments</h2>
            <button
              onClick={() => setShowDocumentDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Document
            </button>
          </div>

          {/* Uploaded Files Grid */}
          {uploadedFiles.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Documents ({uploadedFiles.length})</h3>
              <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                  rowData={uploadedFiles}
                  columnDefs={fileColumnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={5}
                  animateRows={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No documents added yet. Click "Add Document" to upload.</p>
            </div>
          )}
        </div>

        {/* Document Upload Dialog */}
        {showDocumentDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Add Document</h2>
                <button
                  onClick={() => {
                    setShowDocumentDialog(false);
                    setCurrentDocument({
                      name: '',
                      description: '',
                      documentTypeIdOrName: '',
                      content: null,
                      fileName: '',
                      fileSize: 0,
                      fileType: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={currentDocument.name}
                      onChange={(e) => setCurrentDocument({ ...currentDocument, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter document name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={currentDocument.description}
                      onChange={(e) => setCurrentDocument({ ...currentDocument, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter document description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                    <input
                      type="text"
                      value={currentDocument.documentTypeIdOrName}
                      onChange={(e) => setCurrentDocument({ ...currentDocument, documentTypeIdOrName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter document type (e.g., Invoice, Packing List)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
                    <div className="mt-1">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded file:border-0
                          file:text-sm file:font-semibold
                          file:bg-orange-50 file:text-orange-700
                          hover:file:bg-orange-100
                          cursor-pointer"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                      />
                    </div>
                    {currentDocument.fileName && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {currentDocument.fileName} ({formatFileSize(currentDocument.fileSize)})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDocumentDialog(false);
                    setCurrentDocument({
                      name: '',
                      description: '',
                      documentTypeIdOrName: '',
                      content: null,
                      fileName: '',
                      fileSize: 0,
                      fileType: ''
                    });
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDocument}
                  className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-white rounded transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Add Document
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-orange-700 hover:bg-orange-800 text-white px-12 py-3 rounded font-medium transition-colors"
          >
            Submit request
          </button>
        </div>
      </div>
    </div>
  );
}