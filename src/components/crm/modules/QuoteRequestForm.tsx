import { useState } from 'react';
import { MessageSquare, X, Plus } from 'lucide-react';

export default function QuoteRequestForm() {
  const [commodities, setCommodities] = useState([
    { id: 1, serviceType: '', commodityType: '', origin: '', destination: '', pickup: '', grossWeight: '', unit: '', height: '', width: '', length: '', description: '' }
  ]);
  
  const [contactInfo, setContactInfo] = useState({
    companyName: '',
    fullName: '',
    email: '',
    phone: ''
  });

  const addCommodity = () => {
    const newId = Math.max(...commodities.map(c => c.id), 0) + 1;
    setCommodities([...commodities, {
      id: newId,
      serviceType: '',
      commodityType: '',
      origin: '',
      destination: '',
      pickup: '',
      grossWeight: '',
      unit: '',
      height: '',
      width: '',
      length: '',
      description: ''
    }]);
  };

  const removeCommodity = (id) => {
    if (commodities.length > 1) {
      setCommodities(commodities.filter(c => c.id !== id));
    }
  };

  const updateCommodity = (id, field, value) => {
    setCommodities(commodities.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const updateContact = (field, value) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { contactInfo, commodities });
    alert('Quote request submitted! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Request A Quote</h1>
        
        {/* Contact Person Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Contact person</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Company name"
                value={contactInfo.companyName}
                onChange={(e) => updateContact('companyName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Full name"
              value={contactInfo.fullName}
              onChange={(e) => updateContact('fullName', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={contactInfo.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={contactInfo.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Commodity & Services Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Commodity & Services</h2>
          
          {commodities.map((commodity, index) => (
            <div key={commodity.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <select
                  value={commodity.serviceType}
                  onChange={(e) => updateCommodity(commodity.id, 'serviceType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="AirFreight">Air Freight</option>
                  <option value="OceanFreight">Ocean Freight</option>
                  <option value="RoadFreight">Road Freight</option>
                  <option value="RailFreight">Rail Freight</option>
                  <option value="Multimodal">Multimodal</option>
                </select>
                
                <select
                  value={commodity.commodityType}
                  onChange={(e) => updateCommodity(commodity.id, 'commodityType', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                >
                  <option value="Dangerous">Dangerous Goods</option>
                  <option value="NonDangerous">Non-Dangerous</option>
                  <option value="General Cargo">General Cargo</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Perishable">Perishable</option>
                </select>

                <textarea
                  placeholder="Description"
                  value={commodity.description}
                  onChange={(e) => updateCommodity(commodity.id, 'description', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 lg:row-span-3"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 ">
                <input
                  type="text"
                  placeholder="Origin"
                  value={commodity.origin}
                  onChange={(e) => updateCommodity(commodity.id, 'origin', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Gross weight"
                    value={commodity.grossWeight}
                    onChange={(e) => updateCommodity(commodity.id, 'grossWeight', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={commodity.unit}
                    onChange={(e) => updateCommodity(commodity.id, 'unit', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                  >
                    <option value="">-- Select unit --</option>
                    <option value="Kilogram">Kilogram</option>
                    <option value="Pound">Pound</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Destination"
                  value={commodity.destination}
                  onChange={(e) => updateCommodity(commodity.id, 'destination', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Height"
                    value={commodity.height}
                    onChange={(e) => updateCommodity(commodity.id, 'height', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Width"
                    value={commodity.width}
                    onChange={(e) => updateCommodity(commodity.id, 'width', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Length"
                    value={commodity.length}
                    onChange={(e) => updateCommodity(commodity.id, 'length', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Pickup (or Delivery) place"
                  value={commodity.pickup}
                  onChange={(e) => updateCommodity(commodity.id, 'pickup', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {commodities.length > 1 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => removeCommodity(commodity.id)}
                    className="text-gray-500 hover:text-red-600 flex items-center gap-2 text-sm"
                  >
                    Remove this commodity | <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addCommodity}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mt-4"
          >
            <Plus className="w-5 h-5 border-2 border-current rounded-full" />
            Add another commodity
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