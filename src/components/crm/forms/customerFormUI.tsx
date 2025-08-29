import { useState, useRef, useEffect, SetStateAction, ChangeEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

interface IDocument {
  id: number;
  name: string;
  description: string;
  documentTypeId: number;
  contentType: string;
  size: number;
  createDate: string;
  documentPath: string;
}

const CustomerFormUI = ({ editId = null, isViewOnly = false }) => {
  const [customerType, setCustomerType] = useState('Individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(editId ? true : false);
  const [loadingError, setLoadingError] = useState('');
  const [fetchedCustomer, setFetchedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [uploadedDocuments, setUploadedDocuments] = useState<IDocument[]>([]);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [viewDocumentId, setViewDocumentId] = useState<number | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState('');
  const fileInputRef = useRef(null);
  const gridRef = useRef(null);
  
  // @ts-ignore
  const { register, handleSubmit, control, formState: { errors }, reset, setValue, watch } = useForm({
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
      contactPersons: [
        {
          id: 0,
          name: '',
          email: '',
          telephoneNumber: '',
          alternateTelephoneNumber: '',
        },
      ],
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
      documents: [],
    },
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

  // @ts-ignore
  const { fields: documentFields, append: appendDocument, remove: removeDocument, replace: replaceDocuments } = useFieldArray({
    control,
    // @ts-ignore
    name: 'documents',
  });

  // Document form state
  const [documentForm, setDocumentForm] = useState<{
    Name: string;
    Description: string;
    DocumentTypeId: number;
    DocumentType: string;
    Content: File | null;
  }>({
    Name: '',
    Description: '',
    DocumentTypeId: 1,
    DocumentType: '',
    Content: null
  });

  // Load customer data if in edit mode
  useEffect(() => {
    if (editId) {
      // Fetch customer data by ID
      const fetchCustomerData = async () => {
        setIsLoading(true);
        setLoadingError('');
        
        try {
          const response = await fetch(`https://localhost:8000/api/core/Customers/${editId}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch customer data: ${response.status}`);
          }
          
          const data = await response.json();
          setFetchedCustomer(data);
          
          // Update form with fetched data
          reset(data);
          
          // Set customer type for conditional rendering
          setCustomerType(data.customerType || 'Individual');
          
          console.log("Customer data loaded successfully:", data);
        } catch (error) {
          console.error('Error fetching customer data:', error);
          setLoadingError('Failed to load customer data. Please try again or contact support.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCustomerData();
    }
  }, [editId, reset]);

  // Fetch documents when in edit mode
  useEffect(() => {
    if (editId) {
      fetchDocuments();
    }
  }, [editId]);
  
  // Function to fetch documents from the backend
  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    setDocumentsError('');
    
    try {
      const response = await fetch('https://localhost:8000/api/documents?documentTypeId=1');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }
      
      const data = await response.json();
      setUploadedDocuments(data);
      
      // Update form documents array with the IDs
      // @ts-ignore
      const documentIds = data.map(doc => ({ documentId: doc.id }));
      replaceDocuments(documentIds);
      
      console.log("Documents loaded successfully:", data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocumentsError('Failed to load documents. Please try again or contact support.');
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // Handle customer type change
  const handleCustomerTypeChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setCustomerType(e.target.value);
  };

  // Handle document form input change
  const handleDocumentInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setDocumentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file input change
  // @ts-ignore
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDocumentForm(prev => ({
      ...prev,
      Content: e.target.files ? e.target.files[0] : null
    }));
  };
  
  // Handle document submission
  const handleDocumentSubmit = async () => {
    setIsUploading(true);
    setUploadError('');
    
    try {
      const formData = new FormData();
      formData.append('Name', documentForm.Name);
      formData.append('Description', documentForm.Description);
      // @ts-ignore
      formData.append('DocumentTypeId', documentForm.DocumentTypeId);
      formData.append('DocumentType', documentForm.DocumentType);
      
      if (documentForm.Content) {
        formData.append('Content', documentForm.Content);
      }
      
      const response = await fetch('https://localhost:8000/api/documents', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // @ts-ignore
      const result = await response.json();
      
      // After successful upload, refresh the documents list
      fetchDocuments();
      
      // Reset the document form
      setDocumentForm({
        Name: '',
        Description: '',
        DocumentTypeId: 1,
        DocumentType: '',
        Content: null
      });
      
      // Close the dialog
      setIsDocumentDialogOpen(false);
      
      // Reset file input
      if (fileInputRef.current) {
        // @ts-ignore
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle viewing a document
  const handleViewDocument = (documentId: number) => {
    setViewDocumentId(documentId);
    setIsViewDialogOpen(true);
    console.log(`Viewing document: ${documentId}`);
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
    // For example:
    // fetch(`https://localhost:8000/api/documents/${documentId}`, { method: 'DELETE' })
    
    // Filter out the document with the given ID from both state arrays
    const updatedDocuments = uploadedDocuments.filter(doc => doc.id !== documentId);
    setUploadedDocuments(updatedDocuments);
    
    // Update the react-hook-form documents array
    // @ts-ignore
    const updatedFormDocuments = documentFields.filter(doc => doc.documentId !== documentId);
    replaceDocuments(updatedFormDocuments);
    
  };

  // Column definitions for the ag-grid
  const [columnDefs] = useState<ColDef<IDocument>[]>([
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 80 },
    { field: 'name', headerName: 'Name', sortable: true, filter: true, flex: 1 },
    { field: 'description', headerName: 'Description', sortable: true, filter: true, flex: 1 },
    { field: 'description', headerName: 'Description', sortable: true, filter: true, flex: 1 },
    { field: 'documentTypeId', headerName: 'Type ID', sortable: true, filter: true, width: 100 },
    { field: 'contentType', headerName: 'File Type', sortable: true, filter: true, width: 120 },
    { field: 'size', headerName: 'Size', sortable: true, filter: true, width: 100,
      valueFormatter: (params: { value: any; }) => formatFileSize(params.value)
    },
    { field: 'createDate', headerName: 'Upload Date', sortable: true, filter: true, width: 160,
      valueFormatter: (params: { value: any; }) => formatDate(params.value)
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: (params: { data: { id: number; }; }) => {
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewDocument(params.data.id)}
              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
            >
              View
            </button>
            <button
              onClick={() => handleDeleteDocument(params.data.id as number)}
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
  
  // Default column definitions
  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
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

  // Form submission handler
  const onSubmit = async (data: any) => {
    // If view only, don't submit
    if (isViewOnly) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      const url = editId 
        ? `https://localhost:8000/api/core/Customers/${editId}` 
        : 'https://localhost:8000/api/core/Customers';
      
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
        throw new Error(`Failed to ${editId ? 'update' : 'create'} customer: ${errorText}`);
      }
      
      const result = await response.json();
      
      setSubmitSuccess(`Customer successfully ${editId ? 'updated' : 'created'}!`);
      
      // If creating a new customer, reset the form
      if (!editId) {
        reset();
        setUploadedDocuments([]);
      }
      
      return result;
    } catch (error) {
      console.error(`Error ${editId ? 'updating' : 'creating'} customer:`, error);
      setSubmitError(`Failed to ${editId ? 'update' : 'create'} customer. Please try again.`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render tabs
  const renderTabs = () => {
    return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'address'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Address
          </button>
          {customerType === 'Company' && (
            <button
              onClick={() => setActiveTab('company')}
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === 'company'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Company Details
            </button>
          )}
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('payee')}
            className={`py-3 px-6 font-medium text-sm ${
              activeTab === 'payee'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Payee Information
          </button>
        </nav>
      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
                // @ts-ignore
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
                // @ts-ignore
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
                // @ts-ignore
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
                // @ts-ignore
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
                // @ts-ignore
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
                // @ts-ignore
                defaultValue={fetchedCustomer?.industry || ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category ID
              </label>
              <input
                type="number"
                {...register('categoryId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category ID
              </label>
              <input
                type="number"
                {...register('subCategoryId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
          </div>
        );
      case 'address':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <input
                {...register('address.addressType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                {...register('address.region')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                {...register('address.city')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-City
              </label>
              <input
                {...register('address.subCity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Woreda
              </label>
              <input
                {...register('address.woreda')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kebele
              </label>
              <input
                {...register('address.kebele')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House No
              </label>
              <input
                {...register('address.houseNo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark
              </label>
              <input
                {...register('address.landmark')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isViewOnly}
              />
            </div>
          </div>
        );
      case 'company':
        return (
          <div className="space-y-8">
            {/* Company Head */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Company Head</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    {...register('companyHead.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    {...register('companyHead.telephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Telephone Number
                  </label>
                  <input
                    {...register('companyHead.alternateTelephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
                  />
                </div>
              </div>
            </div>
            
            {/* Company Owner */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Company Owner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    {...register('companyOwner.name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone Number
                  </label>
                  <input
                    {...register('companyOwner.telephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Telephone Number
                  </label>
                  <input
                    {...register('companyOwner.alternateTelephoneNumber')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isViewOnly}
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Persons */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Contact Persons</h3>
                {!isViewOnly && (
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
                )}
              </div>
              
              {contactFields.length === 0 ? (
                <p className="text-gray-500 italic">No contact persons added yet.</p>
            ) : (
                contactFields.map((field, index) => (
                  <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium">Contact Person #{index + 1}</h3>
                      {!isViewOnly && (
                        <button
                          type="button"
                          onClick={() => removeContact(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          {...register(`contactPersons.${index}.name`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isViewOnly}
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
                          disabled={isViewOnly}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telephone Number
                        </label>
                        <input
                          {...register(`contactPersons.${index}.telephoneNumber`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isViewOnly}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternate Telephone Number
                        </label>
                        <input
                          {...register(`contactPersons.${index}.alternateTelephoneNumber`)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isViewOnly}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Specializations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Specializations</h3>
                {!isViewOnly && (
                  <button
                    type="button"
                    // @ts-ignore
                    onClick={() => appendSpecialization('')}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Add Specialization
                  </button>
                )}
              </div>
              
              {specializationFields.length === 0 ? (
                <p className="text-gray-500 italic">No specializations added yet.</p>
              ) : (
                <div className="space-y-2">
                  {specializationFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        {...register(`specializations.${index}`)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isViewOnly}
                      />
                      {!isViewOnly && (
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'documents':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Documents</h3>
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
            
            { (!isLoadingDocuments && uploadedDocuments.length === 0) ? (
              <>
              <p className="text-gray-500 italic">No documents added yet. {!isViewOnly && 'Click "Upload Document" to add one.'}</p>
              <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  ref={gridRef}
                  rowData={uploadedDocuments}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  pagination={true}
                  paginationPageSize={50}
                  suppressRowClickSelection={true} />
              </div>
              </>
            ): ( <p className="text-gray-500 italic">No documents added yet. {!isViewOnly && 'Click "Upload Document" to add one.'}</p>
)
          }
          </div>
        );
      case 'payee':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Payee Customer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  {...register('payeeCustomer.name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isViewOnly}
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
                  disabled={isViewOnly}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone Number
                </label>
                <input
                  {...register('payeeCustomer.telephoneNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isViewOnly}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Telephone Number
                </label>
                <input
                  {...register('payeeCustomer.alternateTelephoneNumber')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isViewOnly}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payee Customer ID
                </label>
                <input
                  type="number"
                  {...register('payeeCustomerId', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isViewOnly 
              ? 'Customer Details' 
              : editId 
                ? 'Edit Customer' 
                : 'New Customer Registration'
            }
          </h1>
          {editId && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">Customer ID:</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{editId}</span>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center h-32">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium text-blue-700">Loading customer data...</span>
            </div>
          </div>
        )}
        
        {/* Loading Error */}
        {loadingError && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
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
          </div>
        )}
        
        {/* Don't render the form while loading in edit mode */}
        {(!editId || (editId && !isLoading)) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Success and Error Messages */}
            {submitSuccess && (
              <div className="mb-6">
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
              </div>
            )}
            
            {submitError && (
              <div className="mb-6">
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
              </div>
            )}
            
            {/* Main Form Content */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {/* Tabs */}
              {renderTabs()}
              
              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
              
              {/* Submit Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
                {!isViewOnly && editId && (
                  <button
                    type="button"
                    onClick={() => {
                      // Refetch the original data
                      if (editId) {
                        setIsLoading(true);
                        fetch(`https://localhost:8000/api/core/Customers/${editId}`)
                          .then(response => {
                            if (!response.ok) throw new Error('Failed to fetch original data');
                            return response.json();
                          })
                          .then(data => {
                            reset(data);
                            setFetchedCustomer(data);
                            setCustomerType(data.customerType || 'Individual');
                          })
                          .catch(error => {
                            console.error('Error resetting form:', error);
                          })
                          .finally(() => {
                            setIsLoading(false);
                          });
                      }
                    }}
                    className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Reset Changes
                  </button>
                )}
                {!isViewOnly && (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                  >
                    {isSubmitting 
                      ? `${editId ? 'Updating' : 'Creating'}...` 
                      : `${editId ? 'Update' : 'Create'} Customer`}
                  </button>
                )}
                {isViewOnly && (
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </form>
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
              
              <div className="space-y-4">
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
                
                <div>
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
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type
                  </label>
                  <input
                    type="text"
                    name="DocumentType"
                    value={documentForm.DocumentType}
                    onChange={handleDocumentInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
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
                    onClick={handleDocumentSubmit}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
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
                      const document = uploadedDocuments.find(doc => doc.id === viewDocumentId);
                      return document ? (
                        <div className="space-y-3">
                          <div className="flex">
                            <span className="font-semibold w-32">Document ID:</span>
                            <span>{document.id}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">Name:</span>
                            <span>{document.name}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">Type ID:</span>
                            <span>{document.documentTypeId}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">Description:</span>
                            <span>{document.description || 'No description'}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">File Type:</span>
                            <span>{document.contentType}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">Size:</span>
                            <span>{formatFileSize(document.size)}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">Upload Date:</span>
                            <span>{formatDate(document.createDate)}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-32">File Path:</span>
                            <span className="text-sm text-gray-500 break-all">{document.documentPath}</span>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                              <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={() => {
                                  // In a real implementation, this would open the document or download it
                                  console.log(`Download document: ${document.id}`);
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
    </div>
  );
};

export default CustomerFormUI;