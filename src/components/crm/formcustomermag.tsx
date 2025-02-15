// @ts-nocheck

export default function FormCustomerManagment()
import { useState } from "react";
import { useMutation } from "react-query";

export default function FormCustomer() {

    const [formData, setFormData] = useState({        
        id: 0,
        customerId: {
            clientCode: '',
            consecutiveNo: '',
            createDate: ''
        },
        name: '',
        clientCode: '',
        customerType: 'Individual',
        contactPersonId: 0,
        alternateContactPersonId: 0,
        contactPerson: {
            id: 0,
            firstName: '',
            lastName: '',
            name: '',
            email: '',
            mobilePhone: ''
        },
        alternateContactPerson: {
            id: 0,
            firstName: '',
            lastName: '',
            name: '',
            email: '',
            mobilePhone: ''
        },
        addressId: 0,
        address: {
            id: 0,
            addressType: '',
            region: '',
            city: '',
            subCity: '',
            woreda: '',
            kebele: '',
            houseNo: '',
            email: '',
            fixedLinePhone: '',
            mobilePhone: '',
            locationNo: ''
        },
        companyHead: {
            id: 0,
            firstName: '',
            lastName: '',
            name: '',
            email: '',
            mobilePhone: ''
        },
        companyOwner: {
            id: 0,
            firstName: '',
            lastName: '',
            name: '',
            email: '',
            mobilePhone: ''
        },
        industry: '',
        specializations: [
            ''
        ],
        categoryId: 0,
        subCategoryId: 0,
        companyOwnerId: 0,
        companyHeadId: 0,
        isActive: true
                  
      });
    
    const mutation = useMutation(async (newCustomer) => {
    const response = await fetch("https://localhost:8000/api/core/Customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCustomer),
        });
        return response.json();
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (e, key) => {
    const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [key]: { ...prev[key], [name]: value },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

  return (
    <Card className="col-span-2">
        <CardContent>
        <div className="bg-orange-500 text-white p-4 rounded-md">
            <h3 className="font-semibold text-lg">Customer Information Form</h3>
            <p className="text-sm">Please fill in the following details to register a new customer.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
           {/* Customer Information Section */}
           <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Customer ID No</label>
                        <input type="text" name="clientCode" placeholder="Enter Customer ID No" value={formData.customerId.clientCode} onChange={(e) => handleNestedChange(e, "customerId")} disabled/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">System Consecutive No.</label>
                        <input type="text" name="consecutiveNo" value={formData.customerId.consecutiveNo} onChange={(e) => handleNestedChange(e, "customerId")} disabled />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Create Date</label>
                        <input type="text" name="createDate" value={formData.customerId.createDate} onChange={(e) => handleNestedChange(e, "customerId")} disabled />                  
                    </div>
                </div>
            </div>
            {/* Address Information Section */}
            <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Address Type</label>
                        <input type="text" name="addressType" placeholder="Enter Address Type" value={formData.address.addressType} onChange={(e) => handleNestedChange(e, "address")} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">City</label>
                        <input type="text" name="city" placeholder="Enter City" value={formData.address.city} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Sub City</label>
                        <input type="text" name="subCity" placeholder="Enter Sub City" value={formData.address.subCity} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Woreda</label>
                        <input type="text" name="woreda" placeholder="Enter Woreda" value={formData.address.woreda} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Kebele</label>
                        <input type="text" name="kebele" placeholder="Enter Kebele" value={formData.address.kebele} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">House No.</label>
                        <input type="text" name="houseNo" placeholder="Enter House No." value={formData.address.houseNo} onChange={(e) => handleNestedChange(e, "address")}/>
                        </div>
                    <div>
                        <label className="block text-sm font-medium">E-mail Address</label>
                        <input type="email" name="email" placeholder="Enter E-mail" value={formData.address.email} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fixed Tele Line No</label>
                        <input type="tel" name="fixedLinePhone" placeholder="Enter Tele Line No" value={formData.address.fixedLinePhone} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mobile Phone No.</label>
                        <input type="tel" name="mobilePhone" placeholder="Enter Mobile No." value={formData.address.mobilePhone} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Location No.</label>
                        <input type="text" name="locationNo" placeholder="Enter Location No." value={formData.address.locationNo} onChange={(e) => handleNestedChange(e, "address")}/>
                    </div>
                </div>
            </div>

            {/* Company Information Section */}
            <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Head Info.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input type="text" name="firstName" placeholder="Enter First Name" value={formData.companyHead.firstName} onChange={(e) => handleNestedChange(e, "companyHead")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Middle</label>
                        <input type="text" name="name" placeholder="Enter Middle Name" value={formData.companyHead.name} onChange={(e) => handleNestedChange(e, "companyHead")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input type="text" name="lastName" placeholder="Enter Middle Name" value={formData.companyHead.lastName} onChange={(e) => handleNestedChange(e, "companyHead")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" placeholder="Enter Woreda" value={formData.companyHead.email} onChange={(e) => handleNestedChange(e, "companyHead")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mobile Phone</label>
                        <input type="text" name="mobilePhone" placeholder="Enter mobilePhone" value={formData.companyHead.mobilePhone} onChange={(e) => handleNestedChange(e, "companyHead")}/>
                    </div>
                  
                </div>
            </div>

            {/* Company Information Section */}
            <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Company Owner Info.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input type="text" name="firstName" placeholder="Enter First Name" value={formData.companyOwner.firstName} onChange={(e) => handleNestedChange(e, "companyOwner")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Middle</label>
                        <input type="text" name="name" placeholder="Enter Middle Name" value={formData.companyOwner.name} onChange={(e) => handleNestedChange(e, "companyOwner")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input type="text" name="lastName" placeholder="Enter Middle Name" value={formData.companyOwner.lastName} onChange={(e) => handleNestedChange(e, "companyOwner")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" placeholder="Enter Woreda" value={formData.companyOwner.email} onChange={(e) => handleNestedChange(e, "companyOwner")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mobile Phone</label>
                        <input type="text" name="mobilePhone" placeholder="Enter mobilePhone" value={formData.companyOwner.mobilePhone} onChange={(e) => handleNestedChange(e, "companyOwner")}/>
                    </div>
                  
                </div>
            </div>

            {/* Contact Person Information */}
            <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Contact Person Info.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input type="text" name="firstName" placeholder="Enter First Name" value={formData.contactPerson.firstName} onChange={(e) => handleNestedChange(e, "contactPerson")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Middle</label>
                        <input type="text" name="name" placeholder="Enter Middle Name" value={formData.contactPerson.name} onChange={(e) => handleNestedChange(e, "contactPerson")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input type="text" name="lastName" placeholder="Enter Middle Name" value={formData.contactPerson.lastName} onChange={(e) => handleNestedChange(e, "contactPerson")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" name="email" placeholder="Enter Woreda" value={formData.contactPerson.email} onChange={(e) => handleNestedChange(e, "contactPerson")}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Mobile Phone</label>
                        <input type="text" name="mobilePhone" placeholder="Enter mobilePhone" value={formData.contactPerson.mobilePhone} onChange={(e) => handleNestedChange(e, "contactPerson")}/>
                    </div>
                  
                </div>
            </div>    

            {/* Contact Person Information */}
            <div className="col-span-3 p-4 rounded-md">
                <h4 className="text-md font-semibold mb-2 bg-orange-200 p-2 rounded-md">Contact Person Info.</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input type="text" name="name" placeholder="Enter First Name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Customer Type</label>
                        <select type="select" name="customerType" value={formData.customerType} onChange={handleChange}>
                            <option value="Individual">Individual</option>
                            <option value="Company">Company</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Industry</label>
                        <input type="text" name="industry" placeholder="Enter Industry Details" value={formData.industry} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">"Customers Specialization</label>
                        <input type="text" name="specializations" placeholder="Enter Specializations" value={formData.specializations} onChange={handleChange} />
                    </div>                                      
                </div>
            </div>                                        
          
            {/* Submit Button */}
            <div className="col-span-3 flex justify-end">
                <button type="submit" className="bg-orange-500 text-white mr-3">Submit</button>
                <button className="bg-blue-400 text-white ">Cancel</button>
            </div>
        </form>
        </CardContent>
  </Card>
  );
};

function Card({ children, className }) {
    return <div className={`bg-white shadow rounded-lg p-4 ${className}`}>{children}</div>;
}
    
function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
}

function Select({ label, options = [], className = "", ...props }) {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <select
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

function Input({ label, type = "text", placeholder, className = "", ...props }) {
    return (
        <div className="flex flex-col">
        {label && <label className="text-sm font-medium mb-1">{label}</label>}
        <input
            type={type}
            placeholder={placeholder}
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
            {...props}
        />
        </div>
    );
}
  
function Button({ type = "button", className = "", children, ...props }) {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className} bg-orange-500 hover:bg-orange-600 text-white`}
            {...props}
            >
            {children}
        </button>
    );
}
  


             
