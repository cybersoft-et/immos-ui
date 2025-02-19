// @ts-nocheck
import { Card } from "./layout/card";
import { CardContent } from "./layout/cardContent";
import CustomersTable from "./tables/customersTable";

const GridCustomers = () => {

  return (
      <Card>
        <CardContent>
        <div className="bg-orange-500 text-white p-4 rounded-md">
            <h3 className="font-semibold text-lg">Customers Table</h3>
        </div>
          <CustomersTable />
        </CardContent>
      </Card>
  );
};

export default GridCustomers;
