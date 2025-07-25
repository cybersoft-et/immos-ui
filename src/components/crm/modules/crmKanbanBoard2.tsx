import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, ChevronDown, Plus, X, Calendar, Phone, Mail, MessageSquare } from 'lucide-react';

// Define interfaces based on provided types
interface CustomerDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface CrmStatusDto {
  id: number;
  statusName: string;
}

interface CommunicationStartModeDto {
  id: number;
  modeName: string;
}

interface CrmDealDto {
  id?: number;
  referenceNumber: string;
  customerId: number;
  communicationStartModeId: number;
  communicationStartDate: string;
  requestedServices: string[];
  recordingPersonnel: string;
  // Additional fields for UI purposes
  customer?: CustomerDto;
  communicationStartMode?: CommunicationStartModeDto;
  status?: CrmStatusDto;
  statusId?: number;
  value?: string;
  createdDate?: string;
  updatedDate?: string | null;
}

interface CrmActivityTypeDto {
  id: number;
  activityName: string;
}

interface CrmActivityDto {
  id: number;
  deal: CrmDealDto;
  dealId: number;
  customer: CustomerDto;
  customerId: number;
  activityType: CrmActivityTypeDto;
  activityTypeId: number;
  description: string;
  activityDate: string;
  createdDate: string;
  updatedDate: string | null;
}

interface CrmStatusHistoryDto {
  id: number;
  deal: CrmDealDto;
  dealId: number;
  previousStatus: CrmStatusDto;
  previousStatusId: number;
  newStatus: CrmStatusDto;
  newStatusId: number;
  notes: string;
  createdDate: string;
}

interface KanbanColumn {
  id: number;
  title: string;
  count: number;
  color: string;
  cards: CrmDealDto[];
}

const crmKanbanBoard2 = () => {
  // Sample status data
  const statuses: CrmStatusDto[] = [
    { id: 1, statusName: 'Lead' },
    { id: 2, statusName: 'Contacted' },
    { id: 3, statusName: 'Qualified' },
    { id: 4, statusName: 'Proposal' },
    { id: 5, statusName: 'Closed Won' },
    { id: 6, statusName: 'Closed Lost' },
  ];
  
  // Sample customer data
//   const customers: CustomerDto[] = [
//     { id: 1, name: 'Acme Corporation', email: 'contact@acme.com', phone: '123-456-7890' },
//     { id: 2, name: 'TechSolutions Inc', email: 'info@techsolutions.com', phone: '234-567-8901' },
//     { id: 3, name: 'Global Industries', email: 'sales@globalindustries.com', phone: '345-678-9012' },
//     { id: 4, name: 'Sunrise Enterprises', email: 'hello@sunrise.com', phone: '456-789-0123' },
//     { id: 5, name: 'Quantum Systems', email: 'support@quantum.com', phone: '567-890-1234' },
//     { id: 6, name: 'Momentum Partners', email: 'partners@momentum.com', phone: '678-901-2345' },
//     { id: 7, name: 'Apex Solutions', email: 'info@apex.com', phone: '789-012-3456' },
//     { id: 8, name: 'Horizon Group', email: 'sales@horizon.com', phone: '890-123-4567' },
//     { id: 9, name: 'Pioneer Technologies', email: 'hello@pioneer.com', phone: '901-234-5678' },
//     { id: 10, name: 'Summit Enterprises', email: 'info@summit.com', phone: '012-345-6789' },
//     { id: 11, name: 'Atlantic Partners', email: 'deals@atlantic.com', phone: '123-456-7890' },
//   ];
  
  // Sample communication start modes
  const communicationStartModes: CommunicationStartModeDto[] = [
    { id: 1, modeName: 'Phone Call' },
    { id: 2, modeName: 'Email' },
    { id: 3, modeName: 'Website Form' },
    { id: 4, modeName: 'Walk-in' },
    { id: 5, modeName: 'Referral' },
    { id: 6, modeName: 'Social Media' },
  ];
  
  // Sample available services
  const availableServices = [
    'Consulting',
    'Software Development',
    'Hardware Supply',
    'System Integration',
    'Maintenance',
    'Training',
    'Technical Support',
    'Cloud Services'
  ];
  
  // Sample deals data with new structure
//   const sampleDeals: CrmDealDto[] = [
//     {
//       id: 1,
//       referenceNumber: 'CRM-2025-001',
//       customerId: 1,
//       communicationStartModeId: 1,
//       communicationStartDate: '2025-03-01T10:00:00Z',
//       requestedServices: ['Consulting', 'Software Development'],
//       recordingPersonnel: 'John Smith',
//       customer: customers[0],
//       communicationStartMode: communicationStartModes[0],
//       status: statuses[0],
//       statusId: 1,
//       value: '$12,500',
//       createdDate: '2025-03-01T10:00:00Z',
//       updatedDate: null
//     },
//     {
//       id: 2,
//       referenceNumber: 'CRM-2025-002',
//       customerId: 2,
//       communicationStartModeId: 2,
//       communicationStartDate: '2025-03-02T11:00:00Z',
//       requestedServices: ['Software Development'],
//       recordingPersonnel: 'Jane Doe',
//       customer: customers[1],
//       communicationStartMode: communicationStartModes[1],
//       status: statuses[0],
//       statusId: 1,
//       value: '$8,750',
//       createdDate: '2025-03-02T11:00:00Z',
//       updatedDate: null
//     },
//     {
//       id: 3,
//       referenceNumber: 'CRM-2025-003',
//       customerId: 3,
//       communicationStartModeId: 3,
//       communicationStartDate: '2025-03-03T09:00:00Z',
//       requestedServices: ['Hardware Supply', 'System Integration'],
//       recordingPersonnel: 'Mike Johnson',
//       customer: customers[2],
//       communicationStartMode: communicationStartModes[2],
//       status: statuses[0],
//       statusId: 1,
//       value: '$15,200',
//       createdDate: '2025-03-03T09:00:00Z',
//       updatedDate: null
//     },
//     {
//       id: 4,
//       referenceNumber: 'CRM-2025-004',
//       customerId: 4,
//       communicationStartModeId: 4,
//       communicationStartDate: '2025-03-04T14:00:00Z',
//       requestedServices: ['Consulting', 'Training'],
//       recordingPersonnel: 'Sarah Wilson',
//       customer: customers[3],
//       communicationStartMode: communicationStartModes[3],
//       status: statuses[1],
//       statusId: 2,
//       value: '$9,300',
//       createdDate: '2025-03-04T14:00:00Z',
//       updatedDate: '2025-03-10T09:00:00Z'
//     },
//     {
//       id: 5,
//       referenceNumber: 'CRM-2025-005',
//       customerId: 5,
//       communicationStartModeId: 5,
//       communicationStartDate: '2025-03-05T16:00:00Z',
//       requestedServices: ['Maintenance', 'Technical Support'],
//       recordingPersonnel: 'David Brown',
//       customer: customers[4],
//       communicationStartMode: communicationStartModes[4],
//       status: statuses[1],
//       statusId: 2,
//       value: '$11,000',
//       createdDate: '2025-03-05T16:00:00Z',
//       updatedDate: '2025-03-12T11:00:00Z'
//     },
//     {
//       id: 6,
//       referenceNumber: 'CRM-2025-006',
//       customerId: 6,
//       communicationStartModeId: 2,
//       communicationStartDate: '2025-02-15T10:00:00Z',
//       requestedServices: ['Software Development', 'Cloud Services'],
//       recordingPersonnel: 'Lisa Garcia',
//       customer: customers[5],
//       communicationStartMode: communicationStartModes[1],
//       status: statuses[2],
//       statusId: 3,
//       value: '$23,000',
//       createdDate: '2025-02-15T10:00:00Z',
//       updatedDate: '2025-03-15T14:00:00Z'
//     },
//     {
//       id: 7,
//       referenceNumber: 'CRM-2025-007',
//       customerId: 7,
//       communicationStartModeId: 1,
//       communicationStartDate: '2025-02-20T09:00:00Z',
//       requestedServices: ['Training', 'Technical Support'],
//       recordingPersonnel: 'Robert Davis',
//       customer: customers[6],
//       communicationStartMode: communicationStartModes[0],
//       status: statuses[2],
//       statusId: 3,
//       value: '$17,500',
//       createdDate: '2025-02-20T09:00:00Z',
//       updatedDate: '2025-03-18T16:00:00Z'
//     },
//     {
//       id: 8,
//       referenceNumber: 'CRM-2025-008',
//       customerId: 8,
//       communicationStartModeId: 6,
//       communicationStartDate: '2025-02-25T11:00:00Z',
//       requestedServices: ['Consulting', 'System Integration'],
//       recordingPersonnel: 'Emma Martinez',
//       customer: customers[7],
//       communicationStartMode: communicationStartModes[5],
//       status: statuses[3],
//       statusId: 4,
//       value: '$42,000',
//       createdDate: '2025-02-25T11:00:00Z',
//       updatedDate: '2025-03-20T10:00:00Z'
//     },
//     {
//       id: 9,
//       referenceNumber: 'CRM-2025-009',
//       customerId: 9,
//       communicationStartModeId: 3,
//       communicationStartDate: '2025-03-01T15:00:00Z',
//       requestedServices: ['Hardware Supply', 'Maintenance'],
//       recordingPersonnel: 'Tom Anderson',
//       customer: customers[8],
//       communicationStartMode: communicationStartModes[2],
//       status: statuses[3],
//       statusId: 4,
//       value: '$31,400',
//       createdDate: '2025-03-01T15:00:00Z',
//       updatedDate: '2025-03-22T09:00:00Z'
//     },
//     {
//       id: 10,
//       referenceNumber: 'CRM-2025-010',
//       customerId: 10,
//       communicationStartModeId: 1,
//       communicationStartDate: '2025-02-10T13:00:00Z',
//       requestedServices: ['Software Development', 'Cloud Services'],
//       recordingPersonnel: 'Anna Taylor',
//       customer: customers[9],
//       communicationStartMode: communicationStartModes[0],
//       status: statuses[4],
//       statusId: 5,
//       value: '$29,800',
//       createdDate: '2025-02-10T13:00:00Z',
//       updatedDate: '2025-04-01T14:00:00Z'
//     },
//     {
//       id: 11,
//       referenceNumber: 'CRM-2025-011',
//       customerId: 11,
//       communicationStartModeId: 2,
//       communicationStartDate: '2025-02-15T10:00:00Z',
//       requestedServices: ['Maintenance', 'Technical Support'],
//       recordingPersonnel: 'Chris White',
//       customer: customers[10],
//       communicationStartMode: communicationStartModes[1],
//       status: statuses[4],
//       statusId: 5,
//       value: '$19,500',
//       createdDate: '2025-02-15T10:00:00Z',
//       updatedDate: '2025-04-05T11:00:00Z'
//     },
//   ];
  
  // Generate initial columns based on statuses
  const generateInitialColumns = (): KanbanColumn[] => {
    return statuses.map(status => {
      const statusDeals = sampleDeals.filter(deal => deal.statusId === status.id);
      let color = 'bg-gray-500';
      
      // Assign colors based on status
      switch(status.id) {
        case 1: color = 'bg-blue-500'; break;    // Lead
        case 2: color = 'bg-purple-500'; break;  // Contacted
        case 3: color = 'bg-yellow-500'; break;  // Qualified
        case 4: color = 'bg-orange-500'; break;  // Proposal
        case 5: color = 'bg-green-500'; break;   // Closed Won
        case 6: color = 'bg-red-500'; break;     // Closed Lost
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
    communicationStartModeId: 1,
    communicationStartDate: new Date().toISOString(),
    requestedServices: [],
    recordingPersonnel: '',
    value: '',
  });

const [customerData, setCustomerData] = useState <CustomerDto | [] > ([]);
const [serviceTypes, setServiceTypes] = useState<ServiceTypeDto[] | [] >([]);
const [communicationModes , setCommunicationModes] = useState<any[]>([]); // Adjust type as needed
  
  // Initialize columns from sample data
  useEffect(() => {
    setColumns(generateInitialColumns());

    const fetchAll = async () => {
      try {
        const [customerRes, serviceTypeRes , communicationModesRes] = await Promise.all([
          fetch(`${API_BASE}/Core/Customers`).then(res => res.json()),
          fetch(`${API_BASE}/Crm/ServiceTypes`).then(res => res.json()),
          fetch(`${API_BASE}/Crm/CommunicationModes`).then(res => res.json()),
        ]);

        setCustomerData(customerRes);        
        setServiceTypes(serviceTypeRes);
        setCommunicationModes(communicationModesRes);

      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchAll();
  }, []);

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
    setShowCardForm(true);
  };

  // Handle input change for new card form
  const handleNewCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customerId' || name === 'communicationStartModeId') {
      setNewCard({ ...newCard, [name]: parseInt(value) });
    } else if (name === 'communicationStartDate') {
      setNewCard({ ...newCard, [name]: new Date(value).toISOString() });
    } else if (name === 'requestedServices') {
      // Handle multiple service selection
      const checkbox = e.target as HTMLInputElement;
      const currentServices = newCard.requestedServices || [];
      
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
  const handleSaveCard = () => {
    if (!newCard.customerId || newCard.customerId === 0) return;
    if (!newCard.recordingPersonnel) return;
    if (!newCard.requestedServices || newCard.requestedServices.length === 0) return;
    if (!newCardColumn) return;
    
    // Find customer by ID
    const customer = customers.find(c => c.id === newCard.customerId);
    if (!customer) return;
    
    // Find communication start mode by ID
    const communicationStartMode = communicationStartModes.find(c => c.id === newCard.communicationStartModeId);
    if (!communicationStartMode) return;
    
    // Find status
    const status = statuses.find(s => s.id === newCardColumn);
    if (!status) return;

    const now = new Date().toISOString();
    
    // Create new CrmDealDto
    const newDealCard: CrmDealDto = {
      id: Math.floor(Math.random() * 1000) + 100,
      referenceNumber: newCard.referenceNumber || `CRM-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customerId: newCard.customerId,
      communicationStartModeId: newCard.communicationStartModeId || 1,
      communicationStartDate: newCard.communicationStartDate || now,
      requestedServices: newCard.requestedServices || [],
      recordingPersonnel: newCard.recordingPersonnel,
      // Additional fields for UI
      customer: customer,
      communicationStartMode: communicationStartMode,
      status: status,
      statusId: status.id,
      createdDate: now,
      updatedDate: null,
      value: newCard.value || '$0'
    };

    const updatedColumns = columns.map(col => {
      if (col.id === newCardColumn) {
        return {
          ...col,
          cards: [...col.cards, newDealCard],
          count: col.cards.length + 1
        };
      }
      return col;
    });

    setColumns(updatedColumns);
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
  
  // Show activity form for a deal
  const handleShowActivityForm = (deal: CrmDealDto) => {
    setSelectedDeal(deal);
    setShowActivityForm(true);
    setNewActivity({
      description: '',
      activityTypeId: 1,
      activityDate: new Date().toISOString().split('T')[0]
    });
  };
  
  // Handle activity input change
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'activityTypeId') {
      setNewActivity({ ...newActivity, [name]: parseInt(value) });
    } else {
      setNewActivity({ ...newActivity, [name]: value });
    }
  };
  
  // Save new activity
  const handleSaveActivity = () => {
    if (!selectedDeal) return;
    if (!newActivity.description) return;
    
    const now = new Date().toISOString();
    
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
      updatedDate: null
    };
    
    // Add activity to activities state
    setActivities([...activities, activity]);
    
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
    <div className="flex flex-col h-full bg-gray-50">
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
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleShowActivityForm(card)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{card.referenceNumber}</p>
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
                    <p className="text-xs text-gray-600 mb-2">by {card.recordingPersonnel}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-green-600">{card.value}</span>
                      <span className="text-xs text-gray-500">{getDaysInStage(card)} days</span>
                    </div>
                  </div>
                ))}

                {/* New Card Form */}
                {showCardForm && newCardColumn === column.id && (
                  <div className="bg-white p-3 rounded-md shadow border-2 border-blue-500">
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="referenceNumber"
                        placeholder="Reference #"
                        className="w-full p-2 border rounded text-sm"
                        value={newCard.referenceNumber}
                        onChange={handleNewCardChange}
                      />
                      <select
                        name="customerId"
                        className="w-full p-2 border rounded text-sm"
                        value={newCard.customerId || 0}
                        onChange={handleNewCardChange}
                      >
                        <option value={0}>Select customer...</option>
                        {customerData.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                      </select>
                      <select
                        name="communicationStartModeId"
                        className="w-full p-2 border rounded text-sm"
                        value={newCard.communicationStartModeId}
                        onChange={handleNewCardChange}
                      >
                        {communicationModes.map(mode => (
                          <option key={mode.id} value={mode.id}>{mode.modeName}</option>
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
                          {ServiceTypes.map(service => (
                            <label key={service} className="flex items-center">
                              <input
                                type="checkbox"
                                name="requestedServices"
                                value={service}
                                checked={newCard.requestedServices?.includes(service) || false}
                                onChange={handleNewCardChange}
                                className="mr-2"
                              />
                              <span className="text-sm">{service}</span>
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
                          Save
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

      {/* Activities List Panel */}
      {activities.length > 0 && (
        <div className="border-t bg-white p-4 max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Recent Activities</h3>
            <button className="text-sm text-blue-500 hover:text-blue-700">View All</button>
          </div>
          <div className="space-y-3">
            {activities.slice().reverse().slice(0, 5).map(activity => (
              <div key={activity.id} className="flex border-b pb-2">
                <div className="mr-3">
                  {activity.activityTypeId === 1 && <Phone className="h-5 w-5 text-blue-500" />}
                  {activity.activityTypeId === 2 && <Calendar className="h-5 w-5 text-green-500" />}
                  {activity.activityTypeId === 3 && <Mail className="h-5 w-5 text-purple-500" />}
                  {activity.activityTypeId === 4 && <MessageSquare className="h-5 w-5 text-yellow-500" />}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <p className="text-sm font-medium mr-2">{activity.customer.name}</p>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{activity.activityType.activityName}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.activityDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default crmKanbanBoard2;