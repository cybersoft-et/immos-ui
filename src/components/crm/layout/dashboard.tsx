// @ts-nocheck

export default function Dashboard() {
  return (
    <div >
        <div className="grid grid-cols-3 gap-6">
          {/* Shipment Metrics */}
          <Card className="col-span-2">
            <CardContent>
              <h3 className="font-semibold text-lg">Shipment Metrics</h3>
              <div className="h-40 bg-gray-100 mt-4">[Chart Placeholder]</div>
            </CardContent>
          </Card>

          {/* Active Shipments */}
          <Card className="col-span-1">
            <CardContent>
              <h3 className="font-semibold text-lg">Active Shipments</h3>
              <div className="flex justify-center items-center h-40">1,600 Shipments</div>
            </CardContent>  
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-6">
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Recent Orders</h3>
              <div className="flex space-x-2">
                <button className="outline">
                  {/* <Search size={16} /> */}
                </button>
                <button className="outline">
                  {/* <Filter size={16} /> */}
                </button>
              </div>
            </div>
            <table className="w-full text-left border-t">
              <thead>
                <tr>
                  <th className="py-2">Shipment ID</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Origin</th>
                  <th className="py-2">Destination</th>
                  <th className="py-2">Estimated Arrival</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 text-blue-600">8f4d43d3-89</td>
                  <td className="py-2">At Origin</td>
                  <td className="py-2">Addis Ababa, Ethiopia</td>
                  <td className="py-2">Memphis, Tennessee</td>
                  <td className="py-2">Mar 12, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-600">8f4d43d3-89</td>
                  <td className="py-2">At Origin</td>
                  <td className="py-2">Addis Ababa, Ethiopia</td>
                  <td className="py-2">Memphis, Tennessee</td>
                  <td className="py-2">Mar 12, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-600">8f4d43d3-89</td>
                  <td className="py-2">At Origin</td>
                  <td className="py-2">Addis Ababa, Ethiopia</td>
                  <td className="py-2">Memphis, Tennessee</td>
                  <td className="py-2">Mar 12, 2025</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-600">8f4d43d3-89</td>
                  <td className="py-2">At Origin</td>
                  <td className="py-2">Addis Ababa, Ethiopia</td>
                  <td className="py-2">Memphis, Tennessee</td>
                  <td className="py-2">Mar 12, 2025</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
        </div>
  );
}


function Card({ children, className }) {
  return <div className={`bg-white shadow rounded-lg p-4 ${className}`}>{children}</div>;
}
  
function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}