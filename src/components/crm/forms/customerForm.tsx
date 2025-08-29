import React, { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
// import { API_BASE } from '../../../utils/api';

interface IContactPerson {
  id: number;
  name: string;
  email: string;
  telephoneNumber: string;
  alternateTelephoneNumber: string;
}

interface IDocument {
  documentId: number;
  customerId?: number;
}

interface IFormInput {
  id: number;
  name: string;
  customerType: 'Individual' | 'Company';
  payeeCustomer: IContactPerson;
  companyHead: IContactPerson;
  contactPersons: IContactPerson[];
  companyHeadId: number;
  companyOwnerId: number;
  companyOwner: IContactPerson;
  address: {
    id: number;
    addressType: string;
    region: string;
    city: string;
    subCity: string;
    woreda: string;
    kebele: string;
    houseNo: string;
    landmark: string;
  };
  industry: string;
  specializations: string[];
  categoryId: number;
  subCategoryId: number;
  payeeCustomerId: number;
  addressId: number;
  email: string;
  telephoneNumber: string;
  alternateTelephoneNumber: string;
  documents: IDocument[];
  clientCode: string;
  consecutiveNo: string;
  customerId: string;
}

const CustomerForm = ({ editId = null, isViewOnly = false }) => {

  const [customerType, setCustomerType] = useState('Individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(editId ? true : false);
  const [loadingError, setLoadingError] = useState('');
  const [fetchedCustomer, setFetchedCustomer] = useState<IFormInput | null>(null);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [viewDocumentId, setViewDocumentId] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState('');
  const today = `PGL-${new Date().getFullYear().toLocaleString().substr(-2)}${new Date().getMonth() + 1}${new Date().getDate()}`;

  const navigate = useNavigate();
  
  const [lookuData, setlookuData] = useState({
    customerCategories: [],
    subCustomerCategories: [],
    documentTypes: [],
    consecutiveNos : 0,
    // consecutiveNos : [{ consecutiveNo: 0, createDate: '' }],
  });
  
  const fileInputRef = useRef(null);
  const gridRef = useRef(null);
  // @ts-ignore
  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch , getValues  } = useForm<IFormInput>({
    defaultValues: {
      id: 0,
      name: '',
      customerType: 'Individual',
      email: '',
      telephoneNumber: '',
      alternateTelephoneNumber: '',
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
      companyOwner: {
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
        alternateTelephoneNumber: ''
      }],
      address: {
        id: 0,
        addressType: 'Home',
        region: 'Ethiopia',
        city: 'Addis Ababa',
        subCity: 'Addis Ketema',
        woreda: '01',
        kebele: '02',
        houseNo: '1234',
        landmark: 'NEW',
      },
      industry: '',
      specializations: [],
      categoryId: 0,
      subCategoryId: 0,
      payeeCustomerId: 0,
      addressId: 0,
      documents: [],
      clientCode: '',
      consecutiveNo: '',
      customerId: '', 
    },
  });

  // @ts-ignore
  const { fields, append } = useFieldArray({
    control,
    name: "documents",
  });

  const [documentForm, setDocumentForm] = useState({
    Name: '',
    Description: '',
    DocumentTypeId: '',
    // DocumentType: '',
    Content: null
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: 'contactPersons',
  });

  const { fields: specializationFields, append: appendSpecialization, remove: removeSpecialization } = useFieldArray({
    control,
     // @ts-ignore 
    name: 'specializations',
  });

  const isEditing = editId !== typeof String && editId !== null && editId !== undefined;
  console.log('#CustomerForm - EDIT ID: ', isEditing, ' Paramters: ', editId);

  const API_BASE: string = import.meta.env.VITE_API_BASE_URL;
  const API_FILE_BASE: string = import.meta.env.VITE_API_FILE_BASE_URL;


  useEffect(() => {

    const fetchAll = async () => {
      try {
        const [CustomerCategoriesRes, subCustomerCategoriesRes, documentTypesRes, consecutiveNoRes] = await Promise.all([
          fetch(`${API_BASE}/Lookups/CustomerCategories`).then(res => res.json()),
          fetch(`${API_BASE}/Lookups/CustomerSubCategories`).then(res => res.json()),
          fetch(`${API_BASE}/documents/documentTypes`).then(res => res.json()),
          fetch(`${API_BASE}/Core/Customers/ConsecutiveNumber`).then(res => res.json()),
        ]);

        setlookuData({
          customerCategories: CustomerCategoriesRes,
          subCustomerCategories: subCustomerCategoriesRes,
          documentTypes: documentTypesRes,
          consecutiveNos : consecutiveNoRes
        });

        setValue('consecutiveNo', consecutiveNoRes);
        //@ts-ignore
        setValue('createDate', today);

      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const fetchCustomerData = async () => {
    
    setIsLoading(true);
    setLoadingError('');
    
    try {
      const response = await fetch(`${API_BASE}/core/Customers/${editId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customer data: ${response.status}`);
      }
      
      const data = await response.json();
      setFetchedCustomer(data);
      
      // Update form with fetched data
      reset(data);
      
      // Set customer type for conditional rendering
      setCustomerType(data.customerType || 'Individual');

      
      // Process documents for the grid
      if (data.documents && data.documents.length > 0) {
        // @ts-ignore 
        const formattedDocs = data.documents.map( doc => ({
          documentId: doc.documentId,
          name: doc.document.name || 'Untitled',
          documentType: doc.document.name || 'Unknown',
          description: doc.document.description || 'No description',
          createDate: doc.document.createdDate || new Date().toLocaleDateString(),
          size : doc.document.size || 0,
          id: doc.documentId,
          // @ts-ignore
          documentTypeId: lookuData.documentTypes.find(type => type.id === doc.document.documentTypeId)?.name || doc.document.documentTypeId,
          contentType: doc.document.contentType || 'application/octet-stream',
          documentPath : doc.document.documentPath ? `${API_FILE_BASE}/${doc.document.documentPath}` : '' ,
        }));

        console.log('##CustomerForm - fetchCustomerData - documentTypes' , lookuData.documentTypes);
        setUploadedDocuments(formattedDocs);
      }
      
      console.log("Customer data loaded successfully:", data);                

    } catch (error) {
      console.error('Error fetching customer data:', error);
      setLoadingError('Failed to load customer data. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (customerId?: any, documentId?: any) => {    
    setIsLoadingDocuments(true);
    setDocumentsError('');
    
    try {

      let response = null;
      
      console.log('#CustomerForm - fetchDocuments - Fetching by' , customerId ? 'By CustomerId : ' + customerId :  `"By DocumentID ${documentId}"` );

      if(customerId !== undefined && customerId !== null && customerId !== 0) {
        response = await fetch(`${API_BASE}/core/Customers/${customerId}/documents`);
      }else if (documentId !== undefined && documentId !== null && documentId !== 0) {
        // Fetch documents by documentId
        response = await fetch(`${API_BASE}/documents/${documentId}`);
      }
      // else{
      //   response = await fetch(`${API_BASE}/documents`);
      // }

      if(response === null) {
        throw new Error('No documents found for the given customer or document ID.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }
                  
      const data = await response.json();

      console.log('#CustomerForm - fetchDocuments - Fetched documents: ', data);

      if(data.documents && data.documents.length > 0) {
        // @ts-ignore
        const formattedDocs = data.documents.map(doc => ({
          documentId: doc.documentId,
          name: doc.document.name || 'Untitled',
          documentType: doc.document.name || 'Unknown',
          description: doc.document.description || 'No description',
          createDate: doc.document.createdDate || new Date().toLocaleDateString(),
          size : doc.document.size || 0,
          id: doc.documentId,
          // @ts-ignore
          documentTypeId: lookuData.documentTypes.find(type => type.id === doc.document.documentTypeId)?.name || doc.document.documentTypeId,
          contentType: doc.document.contentType || 'application/octet-stream',
          documentPath : doc.document.documentPath ? `${API_FILE_BASE}/${doc.document.documentPath}` : '' ,
        }));
        console.log('#CustomerForm - fetchDocuments -M-data.documents formattedDocs: ', formattedDocs);
        setUploadedDocuments(formattedDocs);

      }else{

        if(data.length > 1){
          // @ts-ignore
          const formattedDocs = data.map(doc => ({
            id: doc.id,
            // @ts-ignore
            documentTypeId: lookuData.documentTypes.find(type => type.id === doc.documentTypeId)?.name || doc.documentTypeId,
            documentId: doc.documentId,
            name: doc.name || 'Untitled',
            documentType: doc.name || 'Unknown',
            description: doc.description || 'No description',
            size: doc.size || 0,
            createDate: doc.createdDate || new Date().toLocaleDateString(),
            contentType : doc.contentType || 'application/octet-stream',
            documentPath : '' ,
          }));

          setUploadedDocuments(formattedDocs);
          console.log("CustomerForm - fetchDocuments -M-data- formattedData:", data);
        }else{

          // check of data is an object or array
          if(!Array.isArray(data)) {
            const formattedDocs = {
              id: data.id,
              // @ts-ignore
              documentTypeId: lookuData.documentTypes.find(type => type.id === data.documentTypeId)?.name || data.documentTypeId,
              documentId: data.documentId,
              name: data.name || 'Untitled',
              documentType: data.name || 'Unknown',
              description: data.description || 'No description',
              size: data.size || 0,
              createDate: data.createdDate || new Date().toLocaleDateString(),
              contentType : data.contentType || 'application/octet-stream',
              documentPath : '' ,
            };
             //@ts-ignore
            setUploadedDocuments([formattedDocs]);
            console.log("CustomerForm - fetchDocuments -S-data- formattedData:", data);

          }else{

            const formattedDocs = {
              id: data[0].id,
              // @ts-ignore
              documentTypeId: lookuData.documentTypes.find(type => type.id === data[0].documentTypeId)?.name || data[0].documentTypeId,
              documentId: data[0].documentId,
              name: data[0].name || 'Untitled',
              documentType: data[0].name || 'Unknown',
              description: data[0].description || 'No description',
              size: data[0].size || 0,
              createDate: data[0].createdDate || new Date().toLocaleDateString(),
              contentType : data[0].contentType || 'application/octet-stream',
              documentPath : '' ,
            };
             //@ts-ignore
            setUploadedDocuments([formattedDocs]);
            console.log("CustomerForm - fetchDocuments -S-data[0]- formattedData:", data);

          }
        }
      }
      
    } catch (error) {
      console.error('#CustomerForm - Error fetching documents:', error);
      setDocumentsError('Failed to load documents. Please try again or contact support.');
    } finally {
      setIsLoadingDocuments(false);
    }
  };


  // Load customer data if in edit mode
  useEffect(() => {
        
    if (isEditing) {
      
      setUploadedDocuments([]);
      fetchCustomerData();

      console.log('#CustomerForm - Fetching customer documents for editId: ', editId);
    } else {
      // Reset the form if editId is null
      console.log('#CustomerForm - Resetting form to default values.');

      reset({
        id: 0,
        name: '',
        customerType: 'Individual',
        email: '',
        telephoneNumber: '',
        alternateTelephoneNumber: '',
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
        companyOwnerId: 0,
        companyOwner: {
          id: 0,
          name: '',
          email: '',
          telephoneNumber: '',
          alternateTelephoneNumber: '',
        },
        addressId: 0,
      });
      
      setCustomerType('Individual');
      setUploadedDocuments([]);
      // fetchDocuments(0); // why do we fetch documents with 0?
    }
  }, [editId, isEditing]); 

  
  // Column definitions for the ag-grid
  const [columnDefs] = useState([
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 80 },
    { field: 'name', headerName: 'Name', sortable: true, filter: true, flex: 1 },
    { field: 'description', headerName: 'Description', sortable: true, filter: true, flex: 1 },
    { field: 'documentTypeId', headerName: 'Type ID', sortable: true, filter: true, width: 100 },
    { field: 'contentType', headerName: 'File Type', sortable: true, filter: true, width: 120 },
    { field: 'size', headerName: 'Size', sortable: true, filter: true, width: 100,
      valueFormatter: (params: { value: number; }) => formatFileSize(params.value)
    },
    { field: 'createDate', headerName: 'Upload Date', sortable: true, filter: true, width: 160,
      valueFormatter: (params: { value: string | number | Date; }) => formatDate(params.value)
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params : any) => {
        return (
          <div className="flex space-x-2">
            <button
              type='button'
              onClick={() => handleViewDocument(params.data.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
            >
              View
            </button>
            <button
              type='button'
              onClick={() => handleDeleteDocument(params.data.id)}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
              disabled={isViewOnly}
            >
              Delete
            </button>
          </div>
        );
      }
    }
  ]);

   // Function to handle viewing a document
   const handleViewDocument = (documentId: React.SetStateAction<null>) => {
    setViewDocumentId(documentId);
    setIsViewDialogOpen(true);
    console.log(`Viewing document: ${documentId} , ${uploadedDocuments}`);
  };
  
  // Function to handle document deletion
  const handleDeleteDocument = (documentId: number) => {
    // Don't allow deletion in view-only mode
    if (isViewOnly) return;
    
    // Ask for confirmation
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    // In a real implementation, you would call an API to delete the document
    // fetch(`${API_BASE}/documents/${documentId}`, { method: 'DELETE' })
    
    // Filter out the document with the given ID from both state arrays
    // @ts-ignore
    const updatedDocuments = uploadedDocuments.filter(doc => doc.id !== documentId);
    setUploadedDocuments(updatedDocuments);
    
    // Update the react-hook-form documents array
    const updatedFormDocuments = documentFields.filter(doc => doc.documentId !== documentId);
    replaceDocuments(updatedFormDocuments);
    
    console.log(`Deleted document: ${documentId}`);
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Format date
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Default column definitions
  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    try {
      const response = await fetch(`${API_BASE}/core/Customers/CustomerId?customerName=${value}`);

      const data = await response.json();
      if (!response.ok) {
          throw new Error(`Failed to fetch customer data: ${response.status}`);
      }
      console.log('#CustomerForm - BLUR: ', data);

      setValue("clientCode", data.clientCode );
      setValue("customerId", data.customerId );
      setValue("consecutiveNo", data.consecutiveNumber );

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  //@ts-ignore
  const { fields: documentFields, append: appendDocument, remove: removeDocument, replace: replaceDocuments } = useFieldArray({
    control,
    name: 'documents',
  });


  const onSubmit = async (data: any) => {
    // If view only, don't submit
    if (isViewOnly) return;

    console.log('#CustomerForm - onSubmit - Form Data: ', data);
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    let result = null;
    try {
      const url = editId 
        ? `${API_BASE}/core/Customers/${editId}` 
        : `${API_BASE}/core/Customers`;
      
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        setSubmitError(`Failed to ${editId ? 'update' : 'create'} customer. ${errorText}.`);
        throw new Error(`Failed to ${editId ? 'update' : 'create'} customer: ${errorText}`);
      }
      
      result = await response.json();      
      setSubmitSuccess(`Customer successfully ${editId ? 'updated' : 'created'}!`);
      
      // If creating a new customer, reset the form
      if (!editId) {
        reset();
        setUploadedDocuments([]);
      }
      // return result;

    } catch (error) {
      console.error(`Error ${editId ? 'updating' : 'creating'} customer:`, error);
      setSubmitError(`Failed to ${editId ? 'update' : 'create'} customer. Please try again.`);
      return null;

    } finally {
      setIsSubmitting(false);

      // After successful upload, refresh the documents list
      if(editId !== null && editId !== undefined && editId !== 0) {
        fetchDocuments(editId); // replaced to fetch docs by ID
        console.log('#CustomerForm - onSubmit - Fetching documents for Customer: ', editId);

      }else{
        navigate('/customerform/edit/:id'.replace(':id', result?.id));
        fetchDocuments(0, result?.id); // replace documents in the form
        console.log('#CustomerForm - onSubmit - Fetching documents for New User: ', result?.id);
      }

    }
  };
  
  const handleDocumentInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setDocumentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: { target: { files: any[]; }; }) => {
    setDocumentForm(prev => ({
      ...prev,
      Content: e.target.files[0]
    }));
  };
  
  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // This prevents the default form submission behavior
    setIsUploading(true);
    setUploadError('');

    let response = null;
    let responseData = null;
    
    try {
      const formData = new FormData();
      formData.append('Name', documentForm.Name);
      formData.append('Description', documentForm.Description);
      formData.append('DocumentTypeId', documentForm.DocumentTypeId);
      // formData.append('DocumentType', documentForm.DocumentType);

      if( editId !== null && editId !== undefined && editId !== 0) {
        formData.append('DocumentTypeIdOrName', documentForm.DocumentTypeId);
      }
      
      if (documentForm.Content) {
        formData.append('Content', documentForm.Content);
      }
      
      
      if( editId !== null && editId !== undefined && editId !== 0) {
        // If editing, send to the specific customer ID
        response = await fetch(`${API_BASE}/core/Customers/${editId}/document`, {
          method: 'PUT',
          body: formData,
        });

      }else{

         response = await fetch(`${API_BASE}/documents`, {
          method: 'POST',
          body: formData,
        });

      }
            
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Reset the document form
      setDocumentForm({
        Name: '',
        Description: '',
        // ts-ignore
        DocumentTypeId: '',
        // DocumentType: '',
        Content: null
      });
      
      // Close the dialog
      setIsDocumentDialogOpen(false);
      
      // Reset file input
      if (fileInputRef.current) {
        // @ts-ignore
        fileInputRef.current.value = '';
      }

      responseData = await response.json();
      console.log('CustomerForm - handleDocumentSubmit - response :', responseData);

    } catch {
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
      // After successful upload, refresh the documents list
      if(editId !== null && editId !== undefined && editId !== 0) {
        
        const formDocuments = getValues("documents");
        console.log('#CustomerForm - handleDocumentSubmit -OLD getValues-Documents : ', formDocuments);   
        
        if(formDocuments.length >= 1){
          append({         
            documentId: Number(responseData[0].id), 
            customerId: Number(editId)      
          })  

        } else{          
          append({         
            documentId: Number(responseData.id), 
            customerId: Number(editId)
          })    
        }

        console.log('#CustomerForm - handleDocumentSubmit -OLD getValues-After-Append-Documents : ', formDocuments);   
        fetchDocuments(editId); // fetch docs by customer ID

      }else{
        // Append the new document to the uploaded documents state
        const formDocuments = getValues("documents");
        console.log('#CustomerForm - handleDocumentSubmit --NEW-CUSTOMER getValues-Documents : ', formDocuments);

        if(formDocuments.length >= 1){
          append({
            documentId: Number(responseData.id), 
            customerId: Number(responseData.createUserId)  
          });

        } else{          
          append({         
            documentId: responseData.id, 
            customerId: responseData.createUserId
          })    
        }
        fetchDocuments(0, responseData?.id); // replace documents in the form
        console.log('#CustomerForm - handleDocumentSubmit -NEW-CUSTOMER Fetching documents for New User: ', responseData?.id);
      }

      setUploadError('');
    }
  };

  const handleCustomerTypeChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCustomerType(e.target.value);
  };

  return (
    <div>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isViewOnly 
          ? 'Customer Details' 
          : editId 
            ? 'Edit Customer' 
            : 'New Customer Registration'
        }
      </h1>
      
      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700">Loading customer data...</span>
          </div>
        </div>
      )}
      
      {/* Loading Error */}
      {loadingError && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{loadingError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Don't render the form while loading in edit mode */}
      {(!editId || (editId && !isLoading)) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Id
              </label>
              <input
                type="text"
                {...register('customerId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Code
              </label>
              <input
                type="text"
                {...register('clientCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Consecutive Number
              </label>
              <input
                type="text"
                {...register('consecutiveNo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.name || ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('customerType')}
                onChange={handleCustomerTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.customerType || 'Individual'}
              >
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>                  
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.email || ''}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register('telephoneNumber', { required: 'Telephone number is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.telephoneNumber || ''}
              />
              {errors.telephoneNumber && <p className="mt-1 text-sm text-red-600">{errors.telephoneNumber.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Telephone Number
              </label>
              <input
                {...register('alternateTelephoneNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.alternateTelephoneNumber || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                {...register('industry')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.industry || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register('categoryId')}
                onChange={handleCustomerTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.categoryId || 'Individual'}
              >
                <option value={0}>Select Category ...</option>                
                {lookuData.customerCategories.map((option, index) => (
                  // @ts-ignore
                  <option key={index} value={option.id}>
                    {/* @ts-ignore */}
                      {option.value}
                  </option>
                ))}            
              </select>
             
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category
              </label>
              <select
                {...register('subCategoryId')}
                onChange={handleCustomerTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // ts-ignore
                defaultValue={fetchedCustomer?.subCategoryId}
              > 
              <option value={0}>Select Sub-Category ...</option>   
                {lookuData.subCustomerCategories.map((option, index) => (
                  // @ts-ignore 
                  <option key={index} value={option.id}>
                    {/* @ts-ignore */}
                      {option.value}
                  </option>
                ))}     
              </select>             
            </div>
          </div>
        </div>
        
        {/* Specializations */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Specializations</h2>
            <button
              type="button"
              //  @ts-ignore
              onClick={() => appendSpecialization('')}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Add Specialization
            </button>
          </div>
          
          {specializationFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`specializations.${index}`)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeSpecialization(index)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <input
                {...register('address.addressType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                {...register('address.region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register('address.city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-City
              </label>
              <input
                {...register('address.subCity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Woreda
              </label>
              <input
                {...register('address.woreda')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kebele
              </label>
              <input
                {...register('address.kebele')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House No
              </label>
              <input
                {...register('address.houseNo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark
              </label>
              <input
                {...register('address.landmark')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Company Information - Only visible when customerType is Company */}
        {/* ts-ignore */}
        {customerType && (
          <>
            {/* Company Head */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Company Head</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    {...register('companyHead.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('companyHead.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    {...register('companyHead.telephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Telephone Number
                  </label>
                  <input
                    {...register('companyHead.alternateTelephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Company Owner */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Company Owner</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    {...register('companyOwner.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('companyOwner.email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    {...register('companyOwner.telephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Telephone Number
                  </label>
                  <input
                    {...register('companyOwner.alternateTelephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Persons */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Contact Persons</h2>
                <button
                  type="button"
                  onClick={() => appendContact({
                    id: 0,
                    name: '',
                    email: '',
                    telephoneNumber: '',
                    alternateTelephoneNumber: '',
                  })}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Add Contact Person
                </button>
              </div>
              
              {contactFields.map((field, index) => (
                <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Contact Person #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        {...register(`contactPersons.${index}.name`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        {...register(`contactPersons.${index}.email`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telephone Number
                      </label>
                      <input
                        {...register(`contactPersons.${index}.telephoneNumber`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Telephone Number
                      </label>
                      <input
                        {...register(`contactPersons.${index}.alternateTelephoneNumber`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Payee Customer */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Payee Customer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                {...register('payeeCustomer.name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('payeeCustomer.email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone Number
              </label>
              <input
                {...register('payeeCustomer.telephoneNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Telephone Number
              </label>
              <input
                {...register('payeeCustomer.alternateTelephoneNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            {!isViewOnly && (
              <button
                type="button"
                onClick={() => setIsDocumentDialogOpen(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                Upload Document
              </button>
            )}
          </div>
          
          {/* Document Loading Error */}
          {documentsError && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{documentsError}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Documents Loading State */}
          {isLoadingDocuments && (
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700">Loading documents...</span>
              </div>
            </div>
          )}
          
          {!isLoadingDocuments && uploadedDocuments.length === 0 ? (
            <p className="text-gray-500 italic">No documents added yet. {!isViewOnly && 'Click "Upload Document" to add one.'}</p>
          ) : (
            // style={{ height: 400, width: '100%' }}
            <div className="ag-theme-alpine max-h-[calc(100vh-4rem)]" style={{ height: 400, width: '100%' }}>
              <AgGridReact
                ref={gridRef}
                rowData={uploadedDocuments}
                // @ts-ignore
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                animateRows={true}
                pagination={true}
                paginationPageSize={50}
                
              />
            </div>
          )}
          
          {/* Document Upload Dialog */}
          {isDocumentDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Upload Document</h3>
                  <button
                    type="button"
                    onClick={() => setIsDocumentDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleDocumentSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="Name"
                      value={documentForm.Name}
                      onChange={handleDocumentInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="Description"
                      value={documentForm.Description}
                      onChange={handleDocumentInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type ID
                    </label>
                    <input
                      type="number"
                      name="DocumentTypeId"
                      value={documentForm.DocumentTypeId}
                      onChange={handleDocumentInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div> */}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Type
                    </label>
                    <select
                      name="DocumentTypeId"
                      onChange={handleDocumentInputChange}
                      value={documentForm.DocumentTypeId}                      
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isViewOnly}
                      // @ts-ignore
                      defaultValue={fetchedCustomer?.DocumentTypeId}
                    >   
                    <option value={0}>Select DocumentType ...</option>            
                      {lookuData.documentTypes.map((option, index) => (
                        // @ts-ignore 
                        <option key={index} value={option.id}>
                            {/* @ts-ignore   */}
                            {option.name}
                        </option>
                      ))}            
                    </select>                     
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      //  @ts-ignore
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {uploadError && (
                    <div className="p-2 bg-red-100 text-red-700 rounded-md">
                      {uploadError}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsDocumentDialogOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      onClick={(e) => {
                        // Handle form submission with additional safeguard
                        e.preventDefault();
                        handleDocumentSubmit(e);
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Document View Dialog */}
          {isViewDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Document Details</h3>
                  <button
                    type="button"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {viewDocumentId && (
                    <div>
                      {(() => {
                        {/* @ts-ignore */}
                        const document = uploadedDocuments.find(doc => doc.id === viewDocumentId);
                        return document ? (
                          <div className="space-y-3">
                            <div className="flex">
                              <span className="font-semibold w-32">Document ID:</span>
                              {/* @ts-ignore */}
                              <span>{document.id}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">Name:</span>
                              {/* @ts-ignore */}
                              <span>{document.name}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">Type ID:</span>
                              {/* @ts-ignore */}
                              <span>{document.documentTypeId}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">Description:</span>
                              {/* @ts-ignore */}
                              <span>{document.description || 'No description'}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">File Type:</span>
                              {/* @ts-ignore */}
                              <span>{document.contentType}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">Size:</span>
                              {/*  @ts-ignore */}
                              <span>{formatFileSize(document.size)}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">Upload Date:</span>
                              {/*  @ts-ignore */}
                              <span>{formatDate(document.createDate)}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold w-32">File Path:</span>
                              {/* @ts-ignore */}
                              <span className="text-sm text-gray-500 break-all">{document.documentPath}</span>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="text-center">
                                <button
                                  type="button"
                                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                  onClick={() => {
                                    // In a real implementation, this would open the document or download it
                                    // @ts-ignore
                                    console.log(`Download document: ${document.id}`);
                                    // @ts-ignore
                                    window.alert(`Document download would start here: ${document.documentPath}`);
                                  }}
                                >
                                  Download Document
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-500">Document not found</p>
                        );
                      })()}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setIsViewDialogOpen(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          {editId && (
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-3 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset Changes
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isSubmitting 
              ? `${editId ? 'Updating' : 'Creating'}...` 
              : `${editId ? 'Update' : 'Create'} Customer`}
          </button>
        </div>
      </form>
      )}
    </div>
    </div>
  );
};

export default CustomerForm;