// @ts-nocheck

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { CardContent } from "./layout/cardContent";
import { Card } from "./layout/card";
import Button  from "./ui/button";
import React from "react";
import { AgGridReact } from "ag-grid-react";

const customerTypeOptions = [
    { value: 'Individual', label: 'Individual' },
    { value: 'Company', label: 'Company' },
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
    id: number
    customerId: {
        clientCode: string
        consecutiveNo: string
        createDate: string
    }
    name: string
    clientCode: string
    customerType: 'Individual'
    contactPersonId: number
    alternateContactPersonId: number
    contactPerson: {
        id: number
        firstName: string
        lastName: string
        name: string
        email: string
        mobilePhone: string
    }
    alternateContactPerson: {
        id: number
        firstName: string
        lastName: string
        name: string
        email: string
        mobilePhone: string
    }
    addressId: number
    address: {
        id: number
        addressType: string
        region: string
        city: string
        subCity: string
        woreda: string
        kebele: string
        houseNo: string
        email: string
        fixedLinePhone: string
        mobilePhone: string
        locationNo: string
    }
    companyHead: {
        id: number
        firstName: string
        lastName: string
        name: string
        email: string
        mobilePhone: string
    }
    companyOwner: {
        id: number
        firstName: string
        lastName: string
        name: string
        email: string
        mobilePhone: string
    }
    industry: string
    specializations: []
    categoryId: number
    subCategoryId: number
    companyOwnerId: number
    companyHeadId: number
  }

export default function FormCustomer() {

    const { register, handleSubmit, setValue } = useForm<IFormInput>();
    const [searchText, setSearchText] = useState("");
    const [deleteItem, setDeleteItem] = useState(null);
    const [ dataGrid , setData] = useState([]);
    
    const mutation = useMutation(async (newCustomer) => {
        const response = await fetch("https://localhost:8000/api/core/Customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCustomer),
        });
        return response.json();
    });    

    const { data  } = useQuery(["customerData"], async () => {
        // const response = await axios.get("https://localhost:8000/api/core/Customers/ConsecutiveNumber");
        const response = await axios.get(`https://localhost:8000/api/core/Customers/CustomerId?customerName=${newCustomer.name}`);
        return response.data;
    });


    useEffect(() => {
        const today = `CS-${new Date().getFullYear().toLocaleString().substr(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`;
        if (data) {
            console.log('#Response ', data);
            setValue("customerId.consecutiveNo", data  );
            setValue("customerId.createDate", today);
        }
        
    }, [data , setValue]);


    const onSubmit : SubmitHandler<IFormInput> = (formData) => {
        console.log('#form-data ', formData);
        mutation.mutate(formData);
    };

    const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const value = e.target.value;
        try {
            const response = await axios.get(`https://localhost:8000/api/core/Customers/${value}`);
            const data = response.data;
            setValue("address.addressType", data.addressType);
            setValue("address.region", data.region);
            setValue("address.city", data.city);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, type = "text", placeholder, className = "" , registerName , requiredState = "false" , ...props }, ref) => {
        return (
            <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <input
                type={type}
                ref={ref}
                onBlur={props.onBlur}
                onChange={props.onChange}
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
        { headerName: "ID", field: "customerId", flex: 1 },
        { headerName: "Name", field: "name", flex: 1 },
        { headerName: "Phone Num.", field: "clientCode", flex: 1 },
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
    <Card className="col-span-2">
        <CardContent>
        <div className="bg-orange-500 text-white p-4 rounded-md">
            <h3 className="font-semibold text-lg">Customer Information Form</h3>
            <p className="text-sm">Please fill in the following details to register a new customer.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {/* Customer Information Section */}
              <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">             
                    <Input label="Client Code" registerName="customerId.clientCode" requiredState="false" disabled />
                    <Input label="System Consecutive No." registerName="customerId.consecutiveNo" requiredState="false" disabled/>
                    <Input label="ID Date" registerName="customerId.createDate" requiredState="false"  disabled/>
                </div>
              </div>

              {/* Commercial Personnel Section */}
              <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Recording Commercial Personnel</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input  label="Name"  placeholder="Enter Name"  registerName="name" requiredState="false" {...register("name")} onBlur={handleBlur} onChange={onchange}/>
                    <Select label="Customer Type"  options={customerTypeOptions} registerName="customerType" requiredState="false" />                                            
                    <Input  label="Industry"   placeholder="Enter Industry Details" registerName="industry" requiredState="false" />
                    <Input  label="Customers Specialization"  placeholder="Enter Specializations" registerName="specializations" requiredState="false"  />
                </div>
              </div>    

              <div className="col-span-5 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Contact Person Tables</h4>
                {/* <Input  label="Name"  placeholder="Enter Name"  registerName="name" requiredState="false" {...register("name")} onBlur={handleBlur} onChange={onchange}/> */}

                <input
                    type="text"
                    placeholder="Search Contacts ..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                />
                <div className="ag-theme-alpine w-full h-[500px]">
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={dataGrid}
                        pagination={true}
                        domLayout='autoHeight'
                        onGridReady={onGridReady}
                        />
                </div>
                {deleteItem && (
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
                )}
                </div>                                       

               {/* Address Information Section */}
               <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input  label="Address Type"  placeholder="Enter Address"  registerName="address.addressType" requiredState="false"   />                 
                  <Input  label="Region"  placeholder="Enter Region"   registerName="address.city" requiredState="false"  />
                  <Input  label="city"  placeholder="Enter City" registerName="address.region" requiredState="false"  />
                  <Input  label="subCity"  placeholder="Enter Sub City" registerName="address.subCity" requiredState="false"  />
                  <Input  label="woreda"  placeholder="Enter Woreda" registerName="address.woreda" requiredState="false" />
                  <Input  label="kebele"  placeholder="Enter Kebele" registerName="address.kebele" requiredState="false"/>
                  <Input  label="houseNo"  placeholder="Enter House No." registerName="address.houseNo" requiredState="false"  />
                  <Input type="email" label="email" placeholder="Enter E-mail" registerName="address.email" requiredState="false" />
                  <Input type="tel" label="fixedLinePhone"  placeholder="Enter Tele Line No" registerName="address.fixedLinePhone" requiredState="false"  />
                  <Input type="tel" label="mobilePhone"  placeholder="Enter Mobile No." registerName="address.mobilePhone" requiredState="false" />
                  <Input  label="locationNo"  placeholder="Enter Location No." registerName="address.locationNo" requiredState="false"/>                  
                </div>
              </div>
              
              {/* Company Head Information Section */}
              <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Head Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* <Input  label="First Name"  placeholder="Enter First Name" registerName="companyHead.firstName" requiredState="false"  />
                    <Input  label="Middle Name"  placeholder="Enter Middle Name" registerName="companyHead.name" requiredState="false" /> */}
                    <Input  label="Full Name"  placeholder="Enter Full Name" registerName="companyHead.lastName" requiredState="false" />
                    <Input type="email" label="Email"  placeholder="Enter Email" registerName="companyHead.email" requiredState="false" />
                    <Input  label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="companyHead.mobilePhone" requiredState="false" />                                 
                </div>
              </div>

              {/* Company Owner Information Section */}
              <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Owner Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* <Input  label="First Name"  placeholder="Enter First Name" registerName="companyOwner.firstName" requiredState="false" />
                    <Input  label="Middle Name"  placeholder="Enter Middle Name" registerName="companyOwner.name" requiredState="false"  /> */}
                    <Input  label="Full Name" placeholder="Enter Full Name" registerName="companyOwner.lastName" requiredState="false"/>
                    <Input type="email" label="Email" placeholder="Enter Email" registerName="companyOwner.email" requiredState="false" />
                    <Input  label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="companyOwner.mobilePhone" requiredState="false"  />                                 
                </div>
              </div>

               {/* Company Contact Person Section */}
               <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Contact Person Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* <Input  label="First Name"  placeholder="Enter First Name" registerName="customerId.firstName" requiredState="false"  />
                    <Input  label="Middle Name"  placeholder="Enter Middle Name" registerName="customerId.name" requiredState="false" /> */}
                    <Input  label="Full Name"  placeholder="Enter Full Name" registerName="customerId.lastName" requiredState="false"/>
                    <Input type="email" label="Email"  placeholder="Enter Email" registerName="customerId.email" requiredState="false" />
                    <Input  label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="customerId.mobilePhone" requiredState="false" />                                 
                </div>
              </div>

              
               {/* Company Contact Person Section */}
               <div className="col-span-3  p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Alternate Contact Person Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* <Input  label="First Name"  placeholder="Enter First Name" registerName="alternateContactPerson.firstName" requiredState="false"  />
                    <Input  label="Middle Name"  placeholder="Enter Middle Name" registerName="alternateContactPerson.name" requiredState="false" /> */}
                    <Input  label="Full Name"  placeholder="Enter Full Name" registerName="alternateContactPerson.lastName" requiredState="false"/>
                    <Input type="email" label="Email"  placeholder="Enter Email" registerName="alternateContactPerson.email" requiredState="false"  />
                    <Input  label="Mobile Phone"  placeholder="Enter mobilePhone" registerName="alternateContactPerson.mobilePhone" requiredState="false"  />                                 
                </div>
              </div>
              
              
              {/* Submit Button */}
              <div className="col-span-3 flex justify-end">
                <Button type="submit" className="bg-orange-500 text-white mr-3" >Submit</Button>
                <Button type="button" className="bg-blue-400 text-white">Cancel</Button>
              </div>
            </form>
        </CardContent>
    </Card>
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
                <option key={index} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
        </div>
    );
}


  
