import { useState } from 'react';
import { MessageSquare, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function QuoteRequestFormPortal() {
  const navigate = useNavigate();

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

  const [attachments, setAttachments] = useState([]);

  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

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

  const API_BASE: string = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    // Prepare payload
    const payload = {
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
      attachments: attachments
    };

    console.log('#QuoteRequestFormPortal : Payload to POST:', JSON.stringify(payload, null, 2));

    // Send to API
    try {
      const response = await fetch(`${API_BASE}/core/Quotations`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
        const errorText = await response.text();
        setSubmitError(`Failed to submit quote request. Please try again later.`);
        throw new Error(`Failed to save Quatation : ${errorText}`);
      }

      const saveQuote = await response.json();
      console.log('#QuoteRequestFormPortal - handleSave: response  ', saveQuote);
      setSubmitSuccess('Quote request submitted successfully!');
      navigate('/requestquoteportal');
        
    } catch (error) {
      throw new Error(`Failed to save Quatation : ${error}`);
    }
    

  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Request A Quote (Portal)</h1>

         {/* Success and Error Messages */}
          {submitSuccess && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{submitSuccess}</p>
                </div>
              </div>
            </div>
          )}
          
          {submitError && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{submitError}</p>
                </div>
              </div>
            </div>
          )}
        
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 m-4">
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

        {/* Submit Button */}
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