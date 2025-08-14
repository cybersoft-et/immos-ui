import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Plus, X, Calendar, Phone, Mail, MessageSquare, Minus, Edit, Send, Clock, BookText } from 'lucide-react';
import { CustomerDto , CrmDealDto, CrmActivityDto, CrmStatusDto, CommunicationStartModeDto, CrmActivityTypeDto, CrmStatusHistoryDto, KanbanColumn, EmailTemplateDto } from '../dtos/customer';

// Define interfaces based on provided types

const CrmKanbanBoard3 = () => {
  // API configuration
  const API_BASE: string = import.meta.env.VITE_API_BASE_URL;
  // State for fetched data
  const [crmData, setCrmData] = useState<CrmDealDto[]>([]);
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [availableServices, setavailableServices] = useState<any[]>([]);
  const [communicationModes, setCommunicationModes] = useState<CommunicationStartModeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateDto[]>([]);


  // Sample status data (this might also come from API later)
  const statuses: CrmStatusDto[] = [
    { id: 1, statusName: 'Initiated' },
    { id: 2, statusName: 'RequestedForQuote' },
    { id: 3, statusName: 'InProgress' },
    { id: 4, statusName: 'ForwardedToCommercialDepartment' },
    { id: 5, statusName: 'Negotiation' },
    { id: 6, statusName: 'Completed' },
    { id: 7, statusName: 'Closed' },
    { id: 8, statusName: 'Lost' },
  ];
  
  // Generate sample deals data (this will be replaced with API call later)
  const generateSampleDeals = (): CrmDealDto[] => {
    // if (customers.length !== 0 || communicationModes.length !== 0){
    //   return [
    //   {
    //     id: 1,
    //     referenceNumber: 'CRM-2025-001',
    //     customerId: customers[0]?.id || 1,
    //     communicationStartModeId: communicationModes[0]?.id || 1,
    //     communicationStartDate: '2025-03-01T10:00:00Z',
    //     requestedServices: ['Consulting', 'Software Development'],
    //     recordingPersonnel: 'John Smith',
    //     customer: customers[0],
    //     communicationStartMode: communicationModes[0],
    //     status: statuses[0],
    //     statusId: 2,
    //     value: '$12,500',
    //     createdDate: '2025-03-01T10:00:00Z',
    //     updatedDate: null
    //   },
    //   {
    //     id: 2,
    //     referenceNumber: 'CRM-2025-002',
    //     customerId: customers[1]?.id || 2,
    //     communicationStartModeId: communicationModes[1]?.id || 2,
    //     communicationStartDate: '2025-03-02T11:00:00Z',
    //     requestedServices: ['Software Development'],
    //     recordingPersonnel: 'Jane Doe',
    //     customer: customers[1],
    //     communicationStartMode: communicationModes[1],
    //     status: statuses[0],
    //     statusId: 3,
    //     value: '$8,750',
    //     createdDate: '2025-03-02T11:00:00Z',
    //     updatedDate: null
    //   },
    //   {
    //     id: 3,
    //     referenceNumber: 'CRM-2025-003',
    //     customerId: customers[2]?.id || 3,
    //     communicationStartModeId: communicationModes[0]?.id || 1,
    //     communicationStartDate: '2025-03-03T09:00:00Z',
    //     requestedServices: ['Hardware Supply', 'System Integration'],
    //     recordingPersonnel: 'Mike Johnson',
    //     customer: customers[2],
    //     communicationStartMode: communicationModes[0],
    //     status: statuses[1],
    //     statusId: 4,
    //     value: '$15,200',
    //     createdDate: '2025-03-03T09:00:00Z',
    //     updatedDate: null
    //   }
    //   ];
    // }else{
      // Fallback to sample data if customers or communication modes are not loaded
      return crmData.map(deal => ({
        // Generate unique ID if not provided
        id : deal.id || Math.floor(Math.random() * 1000) + 100,
        referenceNumber: deal.referenceNumber || `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerId: deal.customerId || 0,
        communicationStartModeId: typeof deal.communicationStartModeId === 'number'
          ? deal.communicationStartModeId
          : (typeof deal.communicationStartMode === 'number'
              ? deal.communicationStartMode
              : (deal.communicationStartMode && 'id' in deal.communicationStartMode
                  ? deal.communicationStartMode.id
                  : 0)),
        communicationStartDate: deal.communicationStartDate || new Date().toISOString(),
        requestedServices: deal.requestedServices || [],
        recordingPersonnel: deal.createdBy || 'Unknown',
        customer: deal.customer ? deal.customer : customers.find(c => c.id === deal.customerId) || { id: 0, name: '' },
        communicationStartMode: communicationModes.find(m => m.id === (typeof deal.communicationStartModeId === 'number'
          ? deal.communicationStartModeId
          : (typeof deal.communicationStartMode === 'number'
              ? deal.communicationStartMode
              : (deal.communicationStartMode && 'id' in deal.communicationStartMode
                  ? deal.communicationStartMode.id
                  : 0)))) || { id: 0, name: '' },
        status: deal.status ? deal.status : statuses.find(s => s.id === deal.statusId)?.statusName || "Initiated" ,
        statusId: deal.statusId ? statuses.find(s => s.id === deal.statusId)?.statusName || statuses.find(s => s.statusName === deal.status)?.id : 1,
        value: '$12,500',
        createdDate: deal.createdDate || new Date().toISOString(),
        updatedDate: null,
      }));
    // }
    
  };

  // Sample email templates (fallback if API fails)
  const fallbackEmailTemplates: EmailTemplateDto[] = [
    {
      id: 1,
      templateName: 'Welcome Email',
      subject: 'Welcome to Our Services - {{customerName}}',
      body: 'Dear {{customerName}},\n\nThank you for choosing our services. We are excited to work with you on your {{requestedServices}} needs.\n\nReference: {{referenceNumber}}\n\nBest regards,\n{{recordingPersonnel}}',
      isActive: true
    },
    {
      id: 2,
      templateName: 'Follow-up Email',
      subject: 'Follow-up on Your Request - {{referenceNumber}}',
      body: 'Dear {{customerName}},\n\nI wanted to follow up on your recent inquiry regarding {{requestedServices}}.\n\nPlease let me know if you have any questions or if there\'s anything else I can help you with.\n\nBest regards,\n{{recordingPersonnel}}',
      isActive: true
    },
    {
      id: 3,
      templateName: 'Proposal Submission',
      subject: 'Proposal for {{requestedServices}} - {{referenceNumber}}',
      body: 'Dear {{customerName}},\n\nPlease find attached our proposal for the {{requestedServices}} you requested.\n\nWe look forward to hearing from you soon.\n\nBest regards,\n{{recordingPersonnel}}',
      isActive: true
    },
    {
      id: 4,
      templateName: 'Status Update',
      subject: 'Status Update - {{referenceNumber}}',
      body: 'Dear {{customerName}},\n\nI wanted to provide you with an update on your request for {{requestedServices}}.\n\nCurrent Status: In Progress\n\nWe will keep you informed of any developments.\n\nBest regards,\n{{recordingPersonnel}}',
      isActive: true
    }
  ];
  
  // Generate initial columns based on statuses
  const generateInitialColumns = (): KanbanColumn[] => {
    const sampleDeals = generateSampleDeals();
    
    return statuses.map(status => {
      const statusDeals = sampleDeals.filter(deal => deal.statusId === status.id);
      let color = 'bg-gray-500';
      
      // Assign colors based on status
      switch(status.id) {
        case 1: color = 'bg-blue-500';   break;      // Initiated
        case 2: color = 'bg-purple-500'; break;      // RequestedForQuote
        case 3: color = 'bg-yellow-500'; break;      // InProgress
        case 4: color = 'bg-orange-500'; break;      // ForwardedToCommercialDepartment
        case 5: color = 'bg-green-500';  break;      // Negotiation
        case 6: color = 'bg-teal-500';   break;      // Completed
        case 7: color = 'bg-gray-700';   break;      // Closed
        case 8: color = 'bg-red-500';    break;      // Lost
        default: color = 'bg-gray-500';
      }
      
      return {
        id: status.id,
        title: status.statusName,
        count: statusDeals.length,
        color: color,
        cards: statusDeals
      };
    });
  };

  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggingCard, setDraggingCard] = useState<{columnId: number, cardId: number} | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCardColumn, setNewCardColumn] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<CrmDealDto | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activities, setActivities] = useState<CrmActivityDto[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<CrmDealDto | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<CrmActivityDto>>({
    description: '',
    activityTypeId: 1,
    activityDate: new Date().toISOString().split('T')[0]
  });
  
  const [newCard, setNewCard] = useState<Partial<CrmDealDto>>({
    referenceNumber: `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    customerId: 0,
    communicationStartModeId: 0,
    communicationStartDate: new Date().toISOString(),
    requestedServices: [],
    recordingPersonnel: '',
    value: '',
  });

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDealForEmail, setSelectedDealForEmail] = useState<CrmDealDto | null>(null);
  const [emailForm, setEmailForm] = useState({
    templateId: 0,
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    priority: 'normal'
  });

  const [showActivitySidebar, setShowActivitySidebar] = useState(false);
  const [selectedDealForActivities, setSelectedDealForActivities] = useState<CrmDealDto | null>(null);



  // Initialize columns from sample data
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [customerRes, serviceTypeRes, communicationModeRes, crmDataResp, emailTemplatesRes] = await Promise.all([
          fetch(`${API_BASE}/Core/Customers`).then(res => res.json()),
          fetch(`${API_BASE}/Crm/ServiceTypes`).then(res => res.json()),
          fetch(`${API_BASE}/Crm/CommunicationModes`).then(res => res.json()),
          fetch(`${API_BASE}/Crm`).then(res => res.json()),
          fetch(`${API_BASE}/Crm/EmailTemplates`).then(res => res.json()),
        ]);

        setCustomers(customerRes);        
        setavailableServices(serviceTypeRes);
        setCommunicationModes(communicationModeRes);
        setCrmData(crmDataResp);

         // Handle email templates response
        if (Array.isArray(emailTemplatesRes) && emailTemplatesRes.length > 0) {
          setEmailTemplates(emailTemplatesRes.filter(template => template.isActive));
        } else {
          setEmailTemplates(fallbackEmailTemplates);
        }

      } catch (error) {
        console.error("API fetch error:", error);
        // Fallback to sample data in case of API error
        setCustomers([
          { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '123-456-7890' },
          { id: 2, name: 'TechSolutions Inc', email: 'info@techsolutions.com', phone: '234-567-8901' },
          { id: 3, name: 'Global Industries', email: 'sales@globalindustries.com', phone: '345-678-9012' },
        ]);
        setCommunicationModes([
          { id: 1, name: 'Phone Call' },
          { id: 2, name: 'Email' },
          { id: 3, name: 'Website Form' },
        ]);
        setavailableServices([
          { id: 1, name: 'Consulting' },
          { id: 2, name: 'Software Development' },
          { id: 3, name: 'Technical Support' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Update columns when data is loaded
  useEffect(() => {
    if (!loading && customers.length > 0 && communicationModes.length > 0) {
      setColumns(generateInitialColumns());
    }
  }, [loading, customers, communicationModes]);

  // Handle card drag start
  const handleDragStart = (e: React.DragEvent, columnId: number, cardId: number) => {
    setDraggingCard({ columnId, cardId });
  };

  // Handle dropping card into column
  const handleDrop = (columnId: number) => {
    if (!draggingCard) return;

    const { columnId: sourceColumnId, cardId } = draggingCard;
    
    // Don't do anything if dropping in the same column
    if (sourceColumnId === columnId) {
      setDraggingCard(null);
      return;
    }

    // Find the source column and card
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const card = sourceColumn.cards.find(c => c.id === cardId);
    if (!card) return;
    
    // Get the target status
    const targetColumn = columns.find(col => col.id === columnId);
    if (!targetColumn) return;
    
    // Remove card from source column
    const updatedSourceCards = sourceColumn.cards.filter(c => c.id !== cardId);
    
    // Create status history record
    const statusHistory: CrmStatusHistoryDto = {
      id: Math.floor(Math.random() * 1000),
      deal: card,
      dealId: card.id || 0,
      previousStatus: { id: card.statusId || 0, statusName: sourceColumn.title },
      previousStatusId: card.statusId || 0,
      newStatus: { id: targetColumn.id, statusName: targetColumn.title },
      newStatusId: targetColumn.id,
      notes: `Status changed from ${sourceColumn.title} to ${targetColumn.title}`,
      createdDate: new Date().toISOString()
    };
    
    // Update the card with new status
    const updatedCard: CrmDealDto = {
      ...card,
      status: { id: targetColumn.id, statusName: targetColumn.title },
      statusId: targetColumn.id,
      updatedDate: new Date().toISOString()
    };
    
    // Add card to target column
    const updatedColumns = columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, cards: updatedSourceCards, count: updatedSourceCards.length };
      }
      if (col.id === columnId) {
        const updatedCards = [...col.cards, updatedCard];
        return { ...col, cards: updatedCards, count: updatedCards.length };
      }
      return col;
    });
    
    // In a real application, you would save the status history to the backend
    console.log('Status history created:', statusHistory);
    
    setColumns(updatedColumns);
    setDraggingCard(null);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter cards based on search term
  const getFilteredColumns = () => {
    if (!searchTerm) return columns;

    return columns.map(column => {
      const filteredCards = column.cards.filter(card => 
        card.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        card.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        ...column,
        cards: filteredCards,
        count: filteredCards.length
      };
    });
  };

  // Show new card form
  const handleAddCard = (columnId: number) => {
    setNewCardColumn(columnId);
    setIsEditMode(false);
    setEditingCard(null);
    setShowCardForm(true);
    // Reset form to default values
    setNewCard({
      referenceNumber: `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerId: 0,
      communicationStartModeId: 1,
      communicationStartDate: new Date().toISOString(),
      requestedServices: [],
      recordingPersonnel: '',
      value: '',
      statusId: columnId,
    });
  };

  // Show edit card form
  const handleEditCard = (card: CrmDealDto , columnId : number) => {
    setEditingCard(card);
    setIsEditMode(true);
    setNewCardColumn(card.statusId || 1);
    setShowCardForm(true);
    // Populate form with existing card data
    setNewCard({
      referenceNumber: card.referenceNumber,
      customerId: card.customerId,
      communicationStartModeId: card.communicationStartModeId,
      communicationStartDate: card.communicationStartDate,
      requestedServices: card.requestedServices,
      recordingPersonnel: card.recordingPersonnel,
      value: card.value || '',
      statusId: columnId || card.statusId || 1,
      status: statuses.find(s => s.id === (columnId || card.statusId))?.statusName || 'Initiated',
    });

    const testData = {
      referenceNumber: card.referenceNumber,
      customerId: card.customerId,
      communicationStartModeId: card.communicationStartModeId,
      communicationStartDate: card.communicationStartDate,
      requestedServices: card.requestedServices,
      recordingPersonnel: card.recordingPersonnel,
      value: card.value || '',
      statusId: columnId || card.statusId || 1,
      status: statuses.find(s => s.id === (columnId || card.statusId))?.statusName || 'Initiated',
    };

    console.log('#crmKanbanBoard3 - handleEditCard: DATA', testData);
  };

  // Handle input change for new card form
  const handleNewCardChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
        try {
          // Fetch reference number based on customer ID
          const response : any = await fetch(`${API_BASE}/Crm/CrmReferenceNumber?customerId=${value}`);

          const data = await response.text();
          if (!response.ok) {
              throw new Error(`Failed to fetch CrmReferenceNumber data: ${response.status}`);
          }
          setNewCard({ ...newCard, referenceNumber: String(data), customerId: parseInt(value)  });

        } catch (error) {
            console.error("Error fetching data:", error);
        }       
    } else if (name === 'communicationStartModeId') {
      setNewCard({ ...newCard, [name]: parseInt(value) });
    } else if (name === 'communicationStartDate') {
      setNewCard({ ...newCard, [name]: new Date(value).toISOString() });
    } else if (name === 'requestedServices') {
      // Handle multiple service selection
      const checkbox = e.target as HTMLInputElement;
      const currentServices = newCard.requestedServices || []; 

      console.log('Checkbox checked:', checkbox.checked, 'Value:', value, 'Current Services:', currentServices);

      if (checkbox.checked) {
        setNewCard({ ...newCard, requestedServices: [...currentServices, value] });
      } else {
        setNewCard({ 
          ...newCard, 
          requestedServices: currentServices.filter(service => service !== value) 
        });
      }    
    } else {
      setNewCard({ ...newCard, [name]: value });
    }   
  };

  // Save new card
  const handleSaveCard = async () => {
    // Validation
    if (
      !newCard.customerId ||
      !newCard.recordingPersonnel ||
      !newCard.requestedServices?.length ||
      !newCardColumn
    ) return;

    const customer = customers.find(c => c.id === newCard.customerId);
    const communicationStartMode = communicationModes.find(c => c.id === newCard.communicationStartModeId);
    const status = statuses.find(s => s.id === newCardColumn)?.statusName || 'Initiated';
    if (!customer || !communicationStartMode || !status) return;

    const now = new Date().toISOString();
    let updatedColumns = columns;
    let apiPayload: Partial<CrmDealDto>;
    let apiMethod = 'POST';
    let apiUrl = `${API_BASE}/Crm`;

    if (isEditMode && editingCard) {
      // Update existing card
      const updatedCard: CrmDealDto = {
        ...editingCard,
        ...newCard,
        customer,
        communicationStartMode : newCard.communicationStartModeId ? newCard.communicationStartModeId : communicationStartMode.id ,
        updatedDate: now,
        status : status ? status : statuses.find(s => s.id === newCardColumn)?.statusName || 'Initiated',
      };

      updatedColumns = columns.map(col => ({
        ...col,
        cards: col.cards.map(card => card.id === editingCard.id ? updatedCard : card)
      }));

      apiPayload = updatedCard;
      apiMethod = 'PUT';
    } else {
      // Create new card
      const newDealCard: CrmDealDto = {
         ...newCard,
        id: Math.floor(Math.random() * 1000) + 100,       
        referenceNumber: newCard.referenceNumber ?? `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        customerId: newCard.customerId ?? 0,
        customer,
        communicationStartMode : newCard.communicationStartModeId ? newCard.communicationStartModeId : communicationStartMode.id ,
        status : status ? status : statuses.find(s => s.id === newCardColumn)?.statusName || 'Initiated',
        createdDate: now,
        updatedDate: null,
        value: newCard.value || '$0'
      };

      updatedColumns = columns.map(col =>
        col.id === newCardColumn
          ? { ...col, cards: [...col.cards, newDealCard], count: col.cards.length + 1 }
          : col
      );

      apiPayload = {
        ...newCard,
        recordingPersonnel: "PAGAdmin"
      };
    }

    setColumns(updatedColumns);

    // API call
    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save deal: ${errorText}`);
      }

      const result = await response.json();
      console.log('#crmKanbanBoard3 - handleSaveCard: ', result);
    } catch (error) {
      console.error("Error submitting card:", error);
    }

    // Reset form and close
    setShowCardForm(false);
    setIsEditMode(false);
    setEditingCard(null);
    setNewCard({
      referenceNumber: `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerId: 0,
      communicationStartModeId: 1,
      communicationStartDate: new Date().toISOString(),
      requestedServices: [],
      recordingPersonnel: '',
      value: '',
    });
    setNewCardColumn(null);
  };

  // Cancel adding new card
  const handleCancelAddCard = () => {
    setShowCardForm(false);
    setNewCard({
      referenceNumber: `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerId: 0,
      communicationStartModeId: 1,
      communicationStartDate: new Date().toISOString(),
      requestedServices: [],
      recordingPersonnel: '',
      value: '',
    });
    setNewCardColumn(null);
  };

  // Show email modal for a deal
  const handleShowEmailModal = (deal: CrmDealDto) => {
    setSelectedDealForEmail(deal);
    setShowEmailModal(true);
    // Pre-populate email form with customer email
    setEmailForm({
      templateId: 0,
      to: deal.customer?.email || '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      priority: 'normal'
    });
  };

  // Handle email form input change
  const handleEmailFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailForm({ ...emailForm, [name]: value });
  };

  // Handle template selection and populate subject/body
  const handleTemplateSelection = (templateId: number) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (!template || !selectedDealForEmail) return;

    // Replace placeholders with actual data
    const replacePlaceholders = (text: string): string => {
      return text
        .replace(/{{customerName}}/g, selectedDealForEmail.customer?.name || '')
        .replace(/{{referenceNumber}}/g, selectedDealForEmail.referenceNumber)
        .replace(/{{requestedServices}}/g, selectedDealForEmail.requestedServices.join(', '))
        .replace(/{{recordingPersonnel}}/g, selectedDealForEmail.recordingPersonnel);
    };

    setEmailForm({
      ...emailForm,
      templateId: templateId,
      subject: replacePlaceholders(template.subject),
      body: replacePlaceholders(template.body)
    });
  };

  // Send email
  const handleSendEmail = async () => {
    if (!selectedDealForEmail) return;
    if (!emailForm.to || !emailForm.subject || !emailForm.body) {
      alert('Please fill in all required fields (To, Subject, Body)');
      return;
    }

    try {
      // Here you would make an API call to send the email
      const emailData = {
        dealId: selectedDealForEmail.id,
        to: emailForm.to,
        cc: emailForm.cc,
        bcc: emailForm.bcc,
        subject: emailForm.subject,
        body: emailForm.body,
        priority: emailForm.priority,
        templateId: emailForm.templateId || null
      };

      // Simulate API call
      console.log('Sending email:', emailData);
      
      // In a real application, you would call:
      // await fetch(`${API_BASE}/Crm/SendEmail`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData)
      // });

      // Create activity record for email sent
      const emailActivity: CrmActivityDto = {
        id: Math.floor(Math.random() * 1000) + 300,
        deal: selectedDealForEmail,
        dealId: selectedDealForEmail.id || 0,
        customer: selectedDealForEmail.customer || { id: 0, name: '' },
        customerId: selectedDealForEmail.customerId,
        activityType: { id: 3, activityName: 'Email' },
        activityTypeId: 3,
        description: `Email sent: ${emailForm.subject}`,
        activityDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        updatedDate: null
      };

      setActivities([...activities, emailActivity]);
      
      // Close modal and reset form
      setShowEmailModal(false);
      setSelectedDealForEmail(null);
      
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  // Cancel email
  const handleCancelEmail = () => {
    setShowEmailModal(false);
    setSelectedDealForEmail(null);
    setEmailForm({
      templateId: 0,
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
      priority: 'normal'
    });
  };
  
  // Show activity form for a deal
  const handleShowActivityForm = (deal: CrmDealDto) => {
    setSelectedDeal(deal);
    setShowActivityForm(true);
    setNewActivity({
      description: '',
      activityTypeId: 1,
      activityDate: new Date().toISOString().split('T')[0],
      communicationDate: new Date().toISOString().split('T')[0],
      communicationMode: getActivityTypeName(newActivity.activityTypeId || 1),
      communicationDetails: '',
      outcome: '',
      personContacted: '',
      recordingPersonnel: 'PAGAdmin',
      crmStatus: null,
      crmStatusId: 1, // Default to 'Initiated'
    });
  };

  // Toggle activities sidebar
  const handleToggleActivitySidebar = () => {
    if (showActivitySidebar) {
      handleCloseActivitiesSidebar();
    } else {
      setShowActivitySidebar(true);
      // If no deal is selected, select the first available deal
      if (!selectedDealForActivities && columns.length > 0) {
        const firstDeal = columns.find(col => col.cards.length > 0)?.cards[0];
        if (firstDeal) {
          setSelectedDealForActivities(firstDeal);
        }
      }
    }
  };

  // Show activities sidebar for a deal
  const handleShowActivitiesSidebar = (deal: CrmDealDto) => {
    setSelectedDealForActivities(deal);
    setShowActivitySidebar(true);
  };

  // Close activities sidebar
  const handleCloseActivitiesSidebar = () => {
    setShowActivitySidebar(false);
    setSelectedDealForActivities(null);
  };

  // Get activities for selected deal
  const getActivitiesForDeal = (dealId: number): CrmActivityDto[] => {
    return activities.filter(activity => activity.dealId === dealId);
  };

  // Format activity date for display
  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  // Get activity icon based on type
  const getActivityIcon = (activityTypeId: number) => {
    switch(activityTypeId) {
      case 1: return <Phone className="h-4 w-4 text-blue-500" />;
      case 2: return <Calendar className="h-4 w-4 text-green-500" />;
      case 3: return <Mail className="h-4 w-4 text-purple-500" />;
      case 4: return <MessageSquare className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get activity color based on type
  const getActivityColor = (activityTypeId: number): string => {
    switch(activityTypeId) {
      case 1: return 'bg-blue-100 border-blue-200';
      case 2: return 'bg-green-100 border-green-200';
      case 3: return 'bg-purple-100 border-purple-200';
      case 4: return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };
  
  // Handle activity input change
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'activityTypeId') {
      setNewActivity({ ...newActivity, [name]: parseInt(value) });
    }else if(name === 'crmStatusId') {
      setNewActivity({ ...newActivity, crmStatus: statuses.find(s => s.id === parseInt(value)) || null });

    } else {
      setNewActivity({ ...newActivity, [name]: value });
    }
  };
  
  // Save new activity
  const handleSaveActivity = async () => {
    if (!selectedDeal) return;
    if (!newActivity.description) return;
    
    const now = new Date().toISOString();
    let apiPayload: Partial<CrmActivityDto>;
    let apiMethod = 'POST';
    let apiUrl = `${API_BASE}/Crm/${selectedDeal.id}/communications`;
    
    // Create new activity
    const activity: CrmActivityDto = {
      id: Math.floor(Math.random() * 1000) + 200,
      deal: selectedDeal,
      dealId: selectedDeal.id || 0,
      customer: selectedDeal.customer || { id: 0, name: '' },
      customerId: selectedDeal.customerId,
      activityType: { id: newActivity.activityTypeId || 1, activityName: getActivityTypeName(newActivity.activityTypeId || 1) },
      activityTypeId: newActivity.activityTypeId || 1,
      description: newActivity.description || '',
      activityDate: newActivity.activityDate || now,
      createdDate: now,
      updatedDate: null,
      crmStatus: newActivity.crmStatus || 'Initiated' ,
      recordingPersonnel: 'PAGAdmin',
      personContacted: newActivity.personContacted || '',
      communicationMode: getActivityTypeName(newActivity.activityTypeId || 1),
      communicationDetails: newActivity.description || '',
      communicationDate: newActivity.communicationDate || now,
      outcome: newActivity.crmStatus['statusName'] || 'Initiated' 
    };

    const apiActivity = {
      communicationDate: now,
      communicationMode: getActivityTypeName(newActivity.activityTypeId || 1),
      communicationDetails: newActivity.description || '',
      personContacted: newActivity.personContacted || '',
      recordingPersonnel: 'PAGAdmin',
      outcome: newActivity.crmStatus['statusName'] || 'Initiated' 
    };

    apiPayload = apiActivity;

    console.log('#crmKanbanBoard3 - handleSaveActivity: ', apiActivity);
    
    // Add activity to activities state
    setActivities([...activities, activity]);

    // // API call
    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save deal: ${errorText}`);
      }

      const result = await response.json();
      console.log('#crmKanbanBoard3 - handleSaveCard: ', result);
    } catch (error) {
      console.error("Error submitting card:", error);
    }
    
    // Close form
    setShowActivityForm(false);
    setSelectedDeal(null);
  };
  
  // Cancel adding new activity
  const handleCancelActivity = () => {
    setShowActivityForm(false);
    setSelectedDeal(null);
  };
  
  // Helper function to get activity type name
  const getActivityTypeName = (id: number): string => {
    switch(id) {
      case 1: return 'Call';
      case 2: return 'Meeting';
      case 3: return 'Email';
      case 4: return 'Note';
      default: return 'Other';
    }
  };
  
  // Calculate days in stage for a deal
  const getDaysInStage = (deal: CrmDealDto): number => {
    if (!deal.updatedDate) {
      // If deal hasn't moved stages, calculate from created date or communication start date
      const startDate = new Date(deal.createdDate || deal.communicationStartDate);
      const today = new Date();
      return Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      // If deal has moved stages, calculate from updated date
      const updatedDate = new Date(deal.updatedDate);
      const today = new Date();
      return Math.floor((today.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
    }
  };

  const filteredColumns = getFilteredColumns();
  
  // Calculate total value of deals
  const calculateTotalValue = (): string => {
    const total = columns.reduce((acc, column) => {
      return acc + column.cards.reduce((colAcc, card) => {
        // Extract numeric value from the card value string
        const valueStr = card.value || '$0';
        const numericValue = parseFloat(valueStr.replace(/[$,]/g, '')) || 0;
        return colAcc + numericValue;
      }, 0);
    }, 0);
    
    // Format as currency
    return `$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="flex h-full bg-gray-50">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showActivitySidebar ? 'mr-80' : ''}`}>
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading CRM data...</div>
          </div>
        )}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">CRM Pipeline</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <button className="flex items-center px-3 py-2 bg-white border rounded-md hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
              </button>
              <button 
                  className={`flex items-center px-3 py-2 border rounded-md transition-colors ${
                    showActivitySidebar 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={handleToggleActivitySidebar}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Activities</span>
                  {activities.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {activities.length}
                    </span>
                  )}
               </button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto p-4">
            <div className="flex space-x-4 h-full">
              {filteredColumns.map(column => (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-72 flex flex-col bg-gray-100 rounded-md"
                  onDrop={() => handleDrop(column.id)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${column.color} mr-2`}></div>
                      <h3 className="font-medium text-gray-800">{column.title}</h3>
                      <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {column.count}
                      </span>
                    </div>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => handleAddCard(column.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Card Container */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {column.cards.map(card => (
                      <div
                        key={card.id}
                        className="bg-white p-3 rounded-md shadow-sm cursor-grab hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, column.id, card.id || 0)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-800">{card.customer?.name}</h4>
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-400 hover:text-green-600 p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowEmailModal(card);
                              }}
                              title="Send Email"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                            <button 
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCard(card, column.id);
                                }}
                                title="Edit Deal"
                              >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                               onClick={(e) => {
                                e.stopPropagation();
                                handleShowActivityForm(card);
                              }}
                              title="Add Activity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-gray-400 hover:text-gray-600"
                               onClick={(e) => {
                                e.stopPropagation();
                                handleShowActivitiesSidebar(card);
                              }}
                              title="Show Activity"
                            >
                              <BookText className="h-4 w-4" />
                            </button>
                            {/* <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </button> */}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2" onClick={() => handleEditCard(card, column.id)} >{card.referenceNumber}</p>
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {card.requestedServices.slice(0, 2).map((service, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {service}
                              </span>
                            ))}
                            {card.requestedServices.length > 2 && (
                              <span className="text-xs text-gray-400">+{card.requestedServices.length - 2} more</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2" onClick={() => handleEditCard(card , column.id)}>by {card.recordingPersonnel}</p>
                        <div className="flex justify-between items-center mt-2" onClick={() => handleEditCard(card , column.id)}>
                          <span className="text-sm font-medium text-green-600">{card.value}</span>
                          <span className="text-xs text-gray-500">{getDaysInStage(card)} days</span>
                        </div>
                      </div>
                    ))}

                    {/* New/ Edit Card Form */}
                    {showCardForm && newCardColumn === column.id && (
                      <div className="bg-white p-3 rounded-md shadow border-2 border-blue-500">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">
                            {isEditMode ? 'Edit Deal' : 'New Deal'}
                          </h4>
                          {isEditMode && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Editing
                            </span>
                          )}
                        </div>
                        <div className="space-y-2"> 
                          <select
                            name="customerId"
                            className="w-full p-2 border rounded text-sm"
                            value={newCard.customerId || 0}
                            onChange={handleNewCardChange}
                          >
                            <option value={0}>Select customer...</option>
                            {customers.map(customer => (
                              <option key={customer.id} value={customer.id}>{customer.name}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            name="referenceNumber"
                            placeholder="Reference #"
                            className="w-full p-2 border rounded text-sm"
                            value={isEditMode ? crmData.find(crmData => crmData.customerId == newCard.customerId  ) ?.referenceNumber : newCard.referenceNumber}
                            onChange={handleNewCardChange}
                            disabled={isEditMode}
                          />
                          <select
                            name="communicationStartModeId"
                            className="w-full p-2 border rounded text-sm"
                            value={newCard.communicationStartModeId || 0}
                            onChange={handleNewCardChange}
                          >
                            <option value={0}>Select Commun. Mode ..</option>
                            {communicationModes.map(mode => (
                              <option key={mode.id} value={mode.id}>{mode.name}</option>
                            ))}
                          </select>
                          <input
                            type="datetime-local"
                            name="communicationStartDate"
                            className="w-full p-2 border rounded text-sm"
                            value={newCard.communicationStartDate ? new Date(newCard.communicationStartDate).toISOString().slice(0, 16) : ''}
                            onChange={handleNewCardChange}
                          />
                          <div>
                            <p className="text-sm text-gray-700 mb-2">Requested Services:</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {availableServices.map(service => (
                                <label key={service.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="requestedServices"
                                    value={service.name}
                                    checked={Array.isArray(newCard.requestedServices) && newCard.requestedServices.includes(service.name)}
                                    onChange={handleNewCardChange}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">{service.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <input
                            type="text"
                            name="recordingPersonnel"
                            placeholder="Recording personnel"
                            className="w-full p-2 border rounded text-sm"
                            value={newCard.recordingPersonnel}
                            onChange={handleNewCardChange}
                          />
                          <input
                            type="text"
                            name="value"
                            placeholder="Deal value (e.g. $10,000)"
                            className="w-full p-2 border rounded text-sm"
                            value={newCard.value}
                            onChange={handleNewCardChange}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button 
                              className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                              onClick={handleCancelAddCard}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={handleSaveCard}
                            >
                              {isEditMode ? 'Update' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>        

          {/* Activity Form Modal */}
          {showActivityForm && selectedDeal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add Activity</h3>
                  <button onClick={handleCancelActivity} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">{selectedDeal.customer?.name}</p>
                  <p className="text-xs text-gray-500">{selectedDeal.referenceNumber}</p>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select
                      name="activityTypeId"
                      className="w-full p-2 border rounded"
                      value={newActivity.activityTypeId}
                      onChange={handleActivityChange}
                    >
                      <option value={1}>Call</option>
                      <option value={2}>Meeting</option>
                      <option value={3}>Email</option>
                      <option value={4}>Note</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="activityDate"
                      className="w-full p-2 border rounded"
                      value={newActivity.activityDate}
                      onChange={handleActivityChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Person Contacted</label>
                    <input
                      type="text"
                      name="personContacted"
                      className="w-full p-2 border rounded"
                      value={newActivity.personContacted}
                      onChange={handleActivityChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full p-2 border rounded"
                      placeholder="Enter activity details..."
                      value={newActivity.description}
                      onChange={handleActivityChange}
                    ></textarea>
                  </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select
                      name="crmStatusId"
                      className="w-full p-2 border rounded"
                      value={newActivity.crmStatusId}
                      onChange={handleActivityChange}
                    >
                      <option value={1}>Initiated</option>
                      <option value={2}>RequestedForQuote</option>
                      <option value={3}>Other</option>
                      <option value={4}>ForwardedToCommercialDepartment</option>
                      <option value={5}>Negotiation</option>
                      <option value={6}>Completed</option>
                      <option value={7}>Closed</option>
                      <option value={8}>Lost</option>
                    </select>
                  </div>
                
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSaveActivity}
                  >
                    Save Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Footer */}
          <div className="p-4 border-t bg-white">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div>
                  <span className="text-sm text-gray-500">Total Deals</span>
                  <p className="font-medium">{columns.reduce((acc, col) => acc + col.count, 0)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Total Value</span>
                  <p className="font-medium text-green-600">{calculateTotalValue()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  <span>View Reports</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Activities Sidebar */}
          {showActivitySidebar && (
            <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium text-gray-800">Activities</h3>
                </div>
                <button 
                  onClick={() => setShowActivitySidebar(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Deal Selection */}
              <div className="p-4 border-b bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Deal:</label>
                <select
                  className="w-full p-2 border rounded-md text-sm"
                  value={selectedDealForActivities?.id || ''}
                  onChange={(e) => {
                    const dealId = parseInt(e.target.value);
                    const deal = columns.flatMap(col => col.cards).find(card => card.id === dealId);
                    if (deal) {
                      setSelectedDealForActivities(deal);
                    }
                  }}
                >
                  <option value="">Select a deal...</option>
                  {columns.flatMap(col => col.cards).map(deal => (
                    <option key={deal.id} value={deal.id}>
                      {deal.customer?.name} - {deal.referenceNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deal Info */}
              {selectedDealForActivities && (
                <div className="p-4 border-b bg-gray-50">
                  <h4 className="font-medium text-gray-800">{selectedDealForActivities.customer?.name}</h4>
                  <p className="text-sm text-gray-600">{selectedDealForActivities.referenceNumber}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedDealForActivities.status?.statusName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getActivitiesForDeal(selectedDealForActivities.id || 0).length} activities
                    </span>
                  </div>
                </div>
              )}

              {/* Activities List */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedDealForActivities ? (
                  <>
                    {getActivitiesForDeal(selectedDealForActivities.id || 0).length > 0 ? (
                      <div className="space-y-3">
                        {getActivitiesForDeal(selectedDealForActivities.id || 0)
                          .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                          .map(activity => (
                          <div 
                            key={activity.id} 
                            className={`p-3 rounded-lg border ${getActivityColor(activity.activityTypeId)} hover:shadow-sm transition-shadow`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity.activityTypeId)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    {activity.activityType.activityName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatActivityDate(activity.createdDate)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 mb-1">{activity.description}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>System Activity</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">No activities yet</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Activities will appear here as they happen
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Select a deal</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Choose a deal to view its activities
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {selectedDealForActivities && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      onClick={() => handleShowActivityForm(selectedDealForActivities)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Activity
                    </button>
                    <button 
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                      onClick={() => handleShowEmailModal(selectedDealForActivities)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Form Modal */}
          {showActivityForm && selectedDeal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Add Activity</h3>
                  <button onClick={handleCancelActivity} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">{selectedDeal.customer?.name}</p>
                  <p className="text-xs text-gray-500">{selectedDeal.referenceNumber}</p>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select
                      name="activityTypeId"
                      className="w-full p-2 border rounded"
                      value={newActivity.activityTypeId}
                      onChange={handleActivityChange}
                    >
                      <option value={1}>Call</option>
                      <option value={2}>Meeting</option>
                      <option value={3}>Email</option>
                      <option value={4}>Note</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="activityDate"
                      className="w-full p-2 border rounded"
                      value={newActivity.activityDate}
                      onChange={handleActivityChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full p-2 border rounded"
                      placeholder="Enter activity details..."
                      value={newActivity.description}
                      onChange={handleActivityChange}
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleSaveActivity}
                  >
                    Save Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Modal */}
          {showEmailModal && selectedDealForEmail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Send Email</h3>
                  <button onClick={handleCancelEmail} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700">Deal: {selectedDealForEmail.customer?.name}</p>
                  <p className="text-xs text-gray-500">{selectedDealForEmail.referenceNumber}</p>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Template</label>
                    <select
                      name="templateId"
                      className="w-full p-2 border rounded"
                      value={emailForm.templateId}
                      onChange={(e) => {
                        handleEmailFormChange(e);
                        if (e.target.value !== '0') {
                          handleTemplateSelection(parseInt(e.target.value));
                        }
                      }}
                    >
                      <option value={0}>Select a template...</option>
                      {emailTemplates.map(template => (
                        <option key={template.id} value={template.id}>{template.templateName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
                    <input
                      type="email"
                      name="to"
                      className="w-full p-2 border rounded"
                      placeholder="recipient@example.com"
                      value={emailForm.to}
                      onChange={handleEmailFormChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                      <input
                        type="email"
                        name="cc"
                        className="w-full p-2 border rounded"
                        placeholder="cc@example.com"
                        value={emailForm.cc}
                        onChange={handleEmailFormChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BCC</label>
                      <input
                        type="email"
                        name="bcc"
                        className="w-full p-2 border rounded"
                        placeholder="bcc@example.com"
                        value={emailForm.bcc}
                        onChange={handleEmailFormChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      className="w-full p-2 border rounded"
                      value={emailForm.priority}
                      onChange={handleEmailFormChange}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full p-2 border rounded"
                      placeholder="Enter email subject"
                      value={emailForm.subject}
                      onChange={handleEmailFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      name="body"
                      rows={8}
                      className="w-full p-2 border rounded"
                      placeholder="Enter your message here..."
                      value={emailForm.body}
                      onChange={handleEmailFormChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={handleCancelEmail}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                    onClick={handleSendEmail}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          )}


        </>
      )}
      </div>
    </div>
  );
};

export default CrmKanbanBoard3;