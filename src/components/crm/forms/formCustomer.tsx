import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { CardContent } from "../layout/cardContent";
import { Card } from "../layout/card";
import Button  from "../ui/button";
import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
// import FormDocumentUpload from "./formDocumentUpload";
import { useParams } from "react-router-dom";
import DocumentManager from "./documentManager";

const customerTypeOptions = [
    { categoryName: 'Individual', label: 'Individual' },
    { categoryName: 'Company', label: 'Company' },
];

interface InputProps {
    label: string;
    type?: string;
    placeholder?: string;
    className?: string;
    registerName: string;
    requiredState?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    [key: string]: any;
}

interface IFormInput {
    id: 0,
    name: string,
    customerType: 'Individual',
    payeeCustomer: {
      id: 0,
      name: string,
      email: string,
      telephoneNumber: string,
      alternateTelephoneNumber: string
    },
    companyHead: {
      id: 0,
      name: string,
      email: string,
      telephoneNumber: string,
      alternateTelephoneNumber: string
    },
    contactPersons: [
      {
        id: 0,
        name: string,
        email: string,
        telephoneNumber: string,
        alternateTelephoneNumber: string
      }
    ],
    companyHeadId: 0,
    companyOwnerId: 0,
    companyOwner: {
      id: 0,
      name: string,
      email: string,
      telephoneNumber: string,
      alternateTelephoneNumber: string
    },
    address: {
      id: 0,
      addressType: string,
      region: string,
      city: string,
      subCity: string,
      woreda: string,
      kebele: string,
      houseNo: string,
      landmark: string
    },
    industry: string,
    specializations: [
      string
    ],
    categoryId: 0,
    subCategoryId: 0,
    payeeCustomerId: 0,
    addressId: 0,
    email: string,
    telephoneNumber: string,
    alternateTelephoneNumber: string,
    documents: [
      {
        documentId: 0
      }
    ],
    clientCode: string,
    consecutiveNo: string,
    createDate: string, 
  }

const FormCustomer = () => {  

  const {id } = useParams<{id: string}>();
  const editId = id?.replace(":", "");

  const isEditing = editId !== "new";

  console.log('#FORM - EDIT ID: ', isEditing , ': ID ' , editId);

  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const [documents, setDocuments] = useState([
    {
      documentId: 0
    }
  ]);

  const [ deleteItem, setDeleteItem] = useState(null);
  const [ dataGrid , setData] = useState([]);

  const [customerOptions, setCustomerOptions] = useState([]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", email: "", telephoneNumber: "", alternateTelephoneNumber: "" });

  const gridRef = useRef(null);

  const mutation = useMutation(async (newCustomer) => {
    const url = isEditing
      ? `https://localhost:8000/api/core/Customers/${editId}`
      : "https://localhost:8000/api/core/Customers";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomer),
    });

    return response.json();
  });


  const onSubmit : SubmitHandler<IFormInput> = (formData) => {
      
      delete formData.customerId;
      formData.specializations = formData.specializations?.split(',');
      formData.contactPersons = rowData?.map((contact) => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        telephoneNumber: contact.telephoneNumber,
        alternateTelephoneNumber: contact.alternateTelephoneNumber
      }));
      isEditing ? formData.id = editId  :  formData.id = 0 ; 

      console.log('#form-data ', formData);
      console.log('#form-data - contactPersons ', formData.contactPersons);
      mutation.mutate(formData);
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      try {
          const response = await axios.get(`https://localhost:8000/api/core/Customers/CustomerId?customerName=${value}`);

          const data = response.data;
          setValue("clientCode", data.clientCode );
          setValue("consecutiveNo", data.consecutiveNumber );
          setValue("createDate", data.customerId);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, type = "text", placeholder, className = "" , registerName , requiredState = "false" , hidden= false, ...props }, ref) => {
      return (
          <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <input
                type={type}
                ref={ref}
                onBlur={props.onBlur}
                onChange={props.onChange}
                hidden={hidden}
                required={requiredState === "true" ? true : false}
                placeholder={placeholder}
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
                {...register(registerName)}
                {...props}
            />
          </div>
      );
  });

  useEffect(() => {
    const today = `PGL-${new Date().getFullYear().toLocaleString().substr(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`;

      axios.get("https://localhost:8000/api/core/Customers")
          .then(response => setData(response.data))
          .catch(error => console.error("Error fetching data:", error));

      const fetchCategoriesOptions = async () => {
        try {
          const response = await axios.get("https://localhost:8000/api/Lookups/CustomerCategories");
          setCustomerOptions(response.data);
        } catch (err) {
          // setError("Failed to load options");
        } finally {
          // setLoading(false);
        }
      };

      const fetchConsecutiveNumber = async () => {
        try {
          const response = await axios.get("https://localhost:8000/api/core/Customers/ConsecutiveNumber"); 
          setValue('consecutiveNo', response.data);
          setValue('createDate', today);
        } catch (err) {
          // setError("Failed to load options");
        } finally {
          // setLoading(false);
        }
      };
      
      fetchCategoriesOptions();
      fetchConsecutiveNumber();

  }, [!isEditing]);

  // useEffect(() => {
  //   if (!isNaN(Number(id))) {
  //       // Fetch customer data for editing
  //       axios.get(`https://localhost:8000/api/core/Customers/${id}`)
  //           .then(response => {
  //               const customerData = response.data;
  //               // Populate form fields with customer data
  //               Object.keys(customerData).forEach(key => {
  //                   setValue(key as keyof IFormInput, customerData[key]);
  //               });
  //           })
  //           .catch(error => console.error("Error fetching customer data:", error));
  //     }
  // }, [isEditing]);
  
    // Fetch customer data if editing
    useEffect(() => {
      if (isEditing) {
        axios
          .get(`https://localhost:8000/api/core/Customers/${id}`)
          .then((response) => {
            const customerData = response.data;
            // Populate form fields with customer data
            Object.keys(customerData).forEach((key) => {
              setValue(key as keyof IFormInput, customerData[key]);
            });
          })
          .catch((error) => console.error("Error fetching customer data:", error));
      }
    }, [isEditing, id]);

  // const onDeleteConfirm = () => {
  //     console.log("Deleting item:", deleteItem);
  //     setDeleteItem(null);
  // };

  const onGridReady = (params) => {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;   
    // params.api.sizeColumnsToFit();
  }

  const columnDefs = [
      { field: "id", headerName: "ID", width: 100 },
      { field: "name", headerName: "Name", width: 150 },
      { field: "email", headerName: "Email", width: 200 },
      { field: "telephoneNumber", headerName: "Telephone", width: 150 },
      { field: "alternateTelephoneNumber", headerName: "Alternate Telephone", width: 180 },
        {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
          <div className="flex gap-2">
            <Button className="sm:rounded bg-orange-500 hover:bg-orange-600" onClick={() => handleEdit(params.data)} size="sm"><FontAwesomeIcon icon={faPenToSquare} /></Button>
            <Button className="sm:rounded bg-blue-500 hover:bg-blue-700" onClick={() => handleDelete(params.data)} size="sm" variant="destructive"><FontAwesomeIcon icon={faTrash} /></Button>
          </div>
      ),
      width: 200,
      sortable: false,
      filter: false,
      },
  ];

  // MOCK DATA FOR CONTACT PERSON   
  const [rowData, setRowData] = useState([
      { id: 1, name: "Abebe", email: "abebe@example.com", telephoneNumber: "123456789", alternateTelephoneNumber: "987654321" },
      { id: 2, name: "Ayele", email: "ayele@example.com", telephoneNumber: "987654321", alternateTelephoneNumber: "123456789" },
      { id: 3, name: "Fuad", email: "fuad@example.com", telephoneNumber: "456123789", alternateTelephoneNumber: "789321456" },
  ]);

  useEffect(() => {
      if (gridRef.current) {
          // gridRef.current.api.sizeColumnsToFit();
      }
  }, [rowData]);

  const handleEdit = (data) => {
      setSelectedRow({ ...data });
      setEditDialogOpen(true);
  };

  const handleDelete = (data) => {
      setSelectedRow(data);
      setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
      setRowData(rowData.filter(row => row.id !== selectedRow.id));
      setDeleteDialogOpen(false);
  };

  const handleNewContactChange = (e) => {
      const { name, value } = e.target;
      setNewContact(prev => ({ ...prev, [name]: value }));
  };

  const saveNewContact = () => {
      setRowData([...rowData, { id: rowData.length + 1, ...newContact }]);
      setNewContactDialogOpen(false);
  };

  const Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          {children}
        </div>
      </div>
    );
  };
  
  const DialogTrigger = ({ children, onClick }) => {
    return <div onClick={onClick}>{children}</div>;
  };
  
  const DialogContent = ({ children }) => {
    return <div className="mt-4">{children}</div>;
  };
  
  const DialogTitle = ({ children }) => {
    return <h2 className="text-lg font-semibold">{children}</h2>;
  };
  
  const DialogFooter = ({ children }) => {
    return <div className="mt-4 flex justify-end gap-2">{children}</div>;
  };

  const handleUploadComplete = (documentIds) => {
    
    // setValue((prev) => ({
    //   ...prev,
    //   documents: [...prev.documents, { documentId }],
    // }));
    setValue( "documents", [{documentId : documentIds} ]);
    console.log('Document ID: ', { documentId : `"${documentIds}"`});
  };
  
  const handleDocumentUpdate = (newDocument) => {
    // setDocuments([...documents, newDocument]);
    setValue( "documents", [{documentId : newDocument} ]);
    console.log('Document ID: ', { documentId : `"${newDocument}"`});
  };
  

  return (
    <div >
      <div className="bg-orange-500 text-white p-4 rounded-md">
          <h3 className="font-semibold text-lg">{isEditing ? "Edit Customer" : "Create New Customer"} Information Form</h3>
          <p className="text-sm">Please fill {isEditing ? "Edit" : "fill"} in the following details to register a new customer.</p>
      </div> 
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-2 p-3">
        <div className="col-span-2">
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">                  
           
            <div className="col-span-3 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Customer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
                  {/* <Input label="AdressID" registerName="addressId" requiredState="false" hidden={true}/> */}
                  <Input label="Full Name *" className="col-span-2" placeholder="Enter Full Name"  registerName="name" requiredState="false" onBlur={handleBlur}/>
                  <Input type="email" label="E-Mail" placeholder="Enter E-Mail" registerName="email" requiredState="false" />
                  <Input type="tel" label="Phone No." placeholder="Enter Phone No." registerName="telephoneNumber" requiredState="false" />
                  <Input type="tel" label="Alternate Phone No." placeholder="Enter Alternate Phone No." registerName="alternateTelephoneNumber" requiredState="false" />
                  <Select label="Customer Type" options={customerTypeOptions} registerName="customerType" requiredState="false" />                                                                
                  <Input  label="Industry" placeholder="Enter Industry Details" registerName="industry" requiredState="false" />
                  <Input  type="textarea"  label="Customers Specialization"  placeholder="Enter Specializations" registerName="specializations" requiredState="false"  />
                  <Select label="Customer Categories" options={customerOptions} registerName="customerType" requiredState="false" />                                                                                

              </div>
            </div>    

            <div className="col-span-5 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Contact Person Tables</h4>  
              <Button onClick={() => setNewContactDialogOpen(true)} className="bg-blue-500 text-white mr-3">New Contact</Button>

              <div className="ag-theme-alpine w-full h-[300px] m-4">
                  <AgGridReact
                      ref={gridRef}
                      rowData={rowData}
                      columnDefs={columnDefs}
                      domLayout='autoHeight'
                      pagination={false}    
                      onGridReady={onGridReady}                    
                      />
              </div>
               {/* Edit Dialog */}
               <Dialog open={newContactDialogOpen} onOpenChange={setNewContactDialogOpen}>
                    <DialogContent>
                        <DialogTitle>Edit Customer Contact </DialogTitle>
                        <div className="space-y-2">
                          <input type="text" name="name" value={newContact.name} onChange={handleNewContactChange} className="w-full p-2 border rounded" placeholder="Name" />
                          <input type="email" name="email" value={newContact.email} onChange={handleNewContactChange} className="w-full p-2 border rounded" placeholder="Email" />
                          <input type="text" name="telephoneNumber" value={newContact.telephoneNumber} onChange={handleNewContactChange} className="w-full p-2 border rounded" placeholder="Telephone" />
                          <input type="text" name="alternateTelephoneNumber" value={newContact.alternateTelephoneNumber} onChange={handleNewContactChange} className="w-full p-2 border rounded" placeholder="Alternate Telephone" />
                        </div>
                        <DialogFooter>
                            <Button className="bg-orange-500 text-white mr-3" onClick={saveNewContact}>Save</Button>
                            <Button className="bg-blue-500 text-white mr-3" onClick={() => setNewContactDialogOpen(false)} variant="secondary">Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <p>Are you sure you want to delete {selectedRow?.name}?</p>
                        <DialogFooter>
                            <Button className="bg-blue-500 text-white mr-3" onClick={() => setDeleteDialogOpen(false)} variant="secondary">No</Button>
                            <Button className="bg-orange-500 text-white mr-3" onClick={confirmDelete} variant="destructive">Yes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>                                       

            <div className="col-span-3 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">                    
                  {/* <Input label="ID"  placeholder="Enter ID" registerName="address.id" requiredState="false"   />                  */}
                  <Input label="Address Type"  placeholder="Enter Address Type" registerName="address.addressType" requiredState="false"   />                 
                  <Input label="Region"  placeholder="Enter Region" registerName="address.city" requiredState="false"  />
                  <Input label="city"  placeholder="Enter City" registerName="address.region" requiredState="false"  />
                  <Input label="subCity"  placeholder="Enter Sub City" registerName="address.subCity" requiredState="false"  />
                  <Input label="woreda"  placeholder="Enter Woreda" registerName="address.woreda" requiredState="false" />
                  <Input label="kebele"  placeholder="Enter Kebele" registerName="address.kebele" requiredState="false"/>
                  <Input label="houseNo"  placeholder="Enter House No." registerName="address.houseNo" requiredState="false"  />
                  <Input label="LandMark" placeholder="Enter landmark" registerName="address.landmark" requiredState="false" />
              </div>
            </div>

            <div className="col-span-3 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Payee Customer</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">              
                  {/* <Input label="Payee Customer ID"  placeholder="Enter Payee Customer ID" registerName="payeeCustomerId" requiredState="false" /> */}
                  <Input label="Full Name"  placeholder="Enter Full Name" registerName="payeeCustomer.name" requiredState="false" />
                  <Input type="email" label="Email"  placeholder="Enter Email" registerName="payeeCustomer.email" requiredState="false" />
                  <Input label="Mobile Phone No."  placeholder="Enter Mobile Phone" registerName="payeeCustomer.telephoneNumber" requiredState="false" />  
                  <Input label="Alternate Phone No."  placeholder="Enter Alternate Phone" registerName="payeeCustomer.alternateTelephoneNumber" requiredState="false" />                                                                
              </div>
            </div>
                
            <div className="col-span-3 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Head Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4">
                  {/* <Input label="company Head Id" placeholder="Enter Company Head Id" registerName="companyHeadId" requiredState="false"/>                   */}
                  <Input label="Full Name"  placeholder="Enter Full Name" registerName="companyHead.name" requiredState="false" />
                  <Input type="email" label="Email" placeholder="Enter Email" registerName="companyHead.email" requiredState="false" />
                  <Input label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="companyHead.mobilePhone" requiredState="false" /> 
                  <Input label="Alternate Phone No."  placeholder="Enter Alternate Phone" registerName="companyHead.alternateTelephoneNumber" requiredState="false" />                                                                                                
              </div>
            </div>

            <div className="col-span-3 p-4 rounded-md">
              <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Owner Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4"> 
                  {/* <Input label="company Owner Id" placeholder="Enter Company OwnerId" registerName="companyOwnerId" requiredState="false"/>                   */}
                  <Input label="Full Name" placeholder="Enter Full Name" registerName="companyOwner.name" requiredState="false"/>
                  <Input type="email" label="Email" placeholder="Enter Email" registerName="companyOwner.email" requiredState="false" />
                  <Input label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="companyOwner.mobilePhone" requiredState="false" />
                  <Input label="Alternate Phone No."  placeholder="Enter Alternate Phone" registerName="companyHead.alternateTelephoneNumber" requiredState="false" />                                                                                                                                 
              </div>
            </div>          
            
            <div className="col-span-3 flex justify-end">
              <Button type="submit" className="bg-orange-500 text-white mr-3" > { isEditing ? 'Update' : 'Submit'}</Button>
              <Button type="button" className="bg-blue-400 text-white">Cancel</Button>
            </div>
          
        </CardContent>
      </Card>
      </div>
      
      <div className="col-span-1">
       {/* Right Side with Grids, File Uploads, and Top Inputs */}
        {/* Top Inputs */}
        <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Generated Inputs:</h4>                
        <div className="grid grid-cols-3 gap-2 m-4">         
          <Input label="Client Code" registerName="clientCode" requiredState="false" disabled />
          <Input label="Consecutive No." registerName="consecutiveNo" requiredState="false" disabled/>
          <Input label="Customer No." registerName="createDate" requiredState="false"  disabled/>
        </div>

        <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md mt-2">Documents To Upload:</h4>                
        {/* File Uploads */}
        <Card className="col-span-2">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <DocumentManager onDocumentUpdate={handleDocumentUpdate} />
              {/* <DocumentManager /> */}              
            </div>
            {/* Display current documents state if needed */}
            <div>
                <h2>Current Documents:</h2>
                <pre>{JSON.stringify(documents, null, 2)}</pre>
              </div>
          </CardContent>
        </Card>
      </div>
      </form>
    </div>
  );
};

function Select({ label, options = [], className = "" , registerName="", requiredState="" , ...props }: { label: string; options: { value: string; label: string }[]; className?: string, registerName: string , requiredState?: string }) {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <select
                name={registerName}               
                required={requiredState === "true" ? true : false}
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
                {...props}
            >
                {options.map((option, index) => (
                <option key={index} value={option.categoryName}>
                    {option.categoryName}
                </option>
                ))}
            </select>
        </div>
    );
}

export default FormCustomer;







  
