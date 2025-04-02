import React, { useState } from 'react';

function FormCustomerDemo() {
    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        customerType: 'Individual',
        payeeCustomer: {
            id: 0,
            name: '',
            email: '',
            telephoneNumber: '',
            alternateTelephoneNumber: '',
        },
        companyHead: {
            id: 0,
            name: '',
            email: '',
            telephoneNumber: '',
            alternateTelephoneNumber: '',
        },
        contactPersons: [{
            id: 0,
            name: '',
            email: '',
            telephoneNumber: '',
            alternateTelephoneNumber: '',
        }],
        companyHeadId: 0,
        companyOwnerId: 0,
        companyOwner: {
            id: 0,
            name: '',
            email: '',
            telephoneNumber: '',
            alternateTelephoneNumber: '',
        },
        address: {
            id: 0,
            addressType: '',
            region: '',
            city: '',
            subCity: '',
            woreda: '',
            kebele: '',
            houseNo: '',
            landmark: '',
        },
        industry: '',
        specializations: [''],
        categoryId: 0,
        subCategoryId: 0,
        payeeCustomerId: 0,
        addressId: 0,
        email: '',
        telephoneNumber: '',
        alternateTelephoneNumber: '',
        documents: [{ documentId: 0 }],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            if (name.startsWith('payeeCustomer.')) {
                const field = name.split('.')[1];
                return { ...prevData, payeeCustomer: { ...prevData.payeeCustomer, [field]: value } };
            }
            if (name.startsWith('companyHead.')) {
                const field = name.split('.')[1];
                return { ...prevData, companyHead: { ...prevData.companyHead, [field]: value } };
            }
            if (name.startsWith('companyOwner.')) {
                const field = name.split('.')[1];
                return { ...prevData, companyOwner: { ...prevData.companyOwner, [field]: value } };
            }
            if (name.startsWith('address.')) {
                const field = name.split('.')[1];
                return { ...prevData, address: { ...prevData.address, [field]: value } };
            }
            if (name.startsWith('contactPersons.')) {
              const [ ,index, field ] = name.split('.');
              const updatedContactPersons = [...prevData.contactPersons];
              updatedContactPersons[index][field] = value;
              return {...prevData, contactPersons: updatedContactPersons}
            }
            if (name.startsWith('documents.')) {
              const [ ,index, field ] = name.split('.');
              const updatedDocuments = [...prevData.documents];
              updatedDocuments[index][field] = value;
              return {...prevData, documents: updatedDocuments}
            }

            return { ...prevData, [name]: value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:8000/api/core/Customers', { // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Customer created successfully!');
                // Handle success (e.g., redirect, show message)
            } else {
                console.error('Failed to create customer:', response.statusText);
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} /></label><br />
            <label>Customer Type:
                <select name="customerType" value={formData.customerType} onChange={handleChange}>
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                </select>
            </label><br />

            {/* Payee Customer */}
            <h3>Payee Customer</h3>
            <label>Name: <input type="text" name="payeeCustomer.name" value={formData.payeeCustomer.name} onChange={handleChange} /></label><br />
            <label>Email: <input type="text" name="payeeCustomer.email" value={formData.payeeCustomer.email} onChange={handleChange} /></label><br />
            <label>Telephone: <input type="text" name="payeeCustomer.telephoneNumber" value={formData.payeeCustomer.telephoneNumber} onChange={handleChange} /></label><br />
            <label>Alternate Telephone: <input type="text" name="payeeCustomer.alternateTelephoneNumber" value={formData.payeeCustomer.alternateTelephoneNumber} onChange={handleChange} /></label><br />

            {/* Company Head */}
            <h3>Company Head</h3>
            <label>Name: <input type="text" name="companyHead.name" value={formData.companyHead.name} onChange={handleChange} /></label><br />
            <label>Email: <input type="text" name="companyHead.email" value={formData.companyHead.email} onChange={handleChange} /></label><br />
            <label>Telephone: <input type="text" name="companyHead.telephoneNumber" value={formData.companyHead.telephoneNumber} onChange={handleChange} /></label><br />
            <label>Alternate Telephone: <input type="text" name="companyHead.alternateTelephoneNumber" value={formData.companyHead.alternateTelephoneNumber} onChange={handleChange} /></label><br />

            {/* Contact Persons (Add more fields as needed) */}
            <h3>Contact Persons</h3>
            {formData.contactPersons.map((person, index) => (
                <div key={index}>
                    <label>Name: <input type="text" name={`contactPersons.${index}.name`} value={person.name} onChange={handleChange} /></label><br />
                    <label>Email: <input type="text" name={`contactPersons.${index}.email`} value={person.email} onChange={handleChange} /></label><br />
                    <label>Telephone: <input type="text" name={`contactPersons.${index}.telephoneNumber`} value={person.telephoneNumber} onChange={handleChange} /></label><br />
                    <label>Alternate Telephone: <input type="text" name={`contactPersons.${index}.alternateTelephoneNumber`} value={person.alternateTelephoneNumber} onChange={handleChange} /></label><br />
                </div>
            ))}

            {/* Company Owner */}
            <h3>Company Owner</h3>
            <label>Name: <input type="text" name="companyOwner.name" value={formData.companyOwner.name} onChange={handleChange} /></label><br />
            <label>Email: <input type="text" name="companyOwner.email" value={formData.companyOwner.email} onChange={handleChange} /></label><br />
            <label>Telephone: <input type="text" name="companyOwner.telephoneNumber" value={formData.companyOwner.telephoneNumber} onChange={handleChange} /></label><br />
            <label>Alternate Telephone: <input type="text" name="companyOwner.alternateTelephoneNumber" value={formData.companyOwner.alternateTelephoneNumber} onChange={handleChange} /></label><br />

            {/* Address */}
            <h3>Address</h3>
            <label>Address Type: <input type="text" name="address.addressType" value={formData.address.addressType} onChange={handleChange} /></label><br />
            <label>Region: <input type="text" name="address.region" value={formData.address.region} onChange={handleChange} /></label><br />
            <label>City: <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} /></label><br />
            {/* ... other address fields */}

            {/* Documents */}
            <h3>Documents</h3>
            {formData.documents.map((doc, index) => (
                <div key={index}>
                    <label>Document ID: <input type="number" name={`documents.${index}.documentId`} value={doc.documentId} onChange={handleChange} /></label><br />
                </div>
            ))}

            <button type="submit">Submit</button>
        </form>
        </div>
    );
}

export default FormCustomerDemo;