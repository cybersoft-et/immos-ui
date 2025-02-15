import React, { useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AllCommunityModule, ModuleRegistry, provideGlobalGridOptions } from 'ag-grid-community';
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CustomersTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);


  useEffect(() => {
    axios.get("https://localhost:8000/api/core/Customers")
      .then(response => setData(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const onDeleteConfirm = () => {
    console.log("Deleting item:", deleteItem);
    setDeleteItem(null);
  };

  const onGridReady = useCallback((params) => {
    params.api.setQuickFilter(searchText);
  }, [searchText]);

  const columnDefs = [
      { headerName: "Customer ID", field: "customerId", flex: 1 },
      { headerName: "Name", field: "name", flex: 1 },
      { headerName: "Client Code", field: "clientCode", flex: 1 },
      { headerName: "Customer Type", field: "customerType", flex: 1 },
      { headerName: "Contact Person ID", field: "industry", flex: 1 },
      // { headerName: "Alternate Contact ID", field: "AlternateContactPersonId", flex: 1 },
      { headerName: "Address ID", field: "name", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        cellRenderer: (params) => (
          <div className="flex gap-2">
            <Button variant="outline" className=" bg-orange-500  hover:bg-orange-600" onClick={() => navigate(`/edit/${params.data.id}`)}>Edit</Button>
            <Button variant="destructive" className="bg-blue-500  hover:bg-blue-600" onClick={() => setDeleteItem(params.data)}>Delete</Button>
          </div>
        ),
        sortable: false,
        filter: false,
      },
  ];

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="ag-theme-alpine w-full h-[500px]">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={data}
          pagination={true}
          domLayout='autoHeight'
          onGridReady={onGridReady}
        />
      </div>
      {/* {deleteItem && (
        <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {deleteItem.name}?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
              <Button variant="destructive" onClick={onDeleteConfirm}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} */}
    </div>
  );
};

export default CustomersTable;

function Button({ type = "button", className = "", children, ...props }) {
  return (
      <button
          type={type}
          className={`px-4 py-2 rounded-lg font-small transition-colors duration-200 ${className} text-white`}
          {...props}
          >
          {children}
      </button>
  );
}

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });
