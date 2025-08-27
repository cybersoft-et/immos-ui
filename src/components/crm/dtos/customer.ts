export interface CustomerDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface CrmStatusDto {
  id: number;
  statusName: string;
}

export interface CommunicationStartModeDto {
  id: number;
  name: string;
}

export interface CrmDealDto {
  id?: number;
  referenceNumber: string;
  customerId: number;
  communicationStartModeId: number;
  communicationStartDate: string;
  requestedServices: string[];
  recordingPersonnel: string;
  // Additional fields for UI purposes
  customer?: CustomerDto;
  communicationStartMode?: CommunicationStartModeDto | number;
  status?: CrmStatusDto | null | string ;
  statusId?: number;
  value?: string;
  createdDate?: string;
  updatedDate?: string | null;
  createdBy?: string | null;
  createDate: string;
  statusName?: string;
}

export interface CrmActivityTypeDto {
  id: number;
  activityName: string;
}

export interface CrmActivityDto {
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
  crmStatus : CrmStatusDto | string | number | null;
  crmStatusId?: number;
  recordingPersonnel: string;
  personContacted: string;
  communicationMode: string;
  communicationDetails: string;
  communicationDate: string;
  outcome: string | null;
  createDate: string;
  crmId?: string;
  statusName?: string;
}


export interface CrmEmailActivityDto {
  id: number;
  deal: CrmDealDto;
  dealId: number;
  customer: CustomerDto;
  customerId: number;
  subject?: string;
  body?: string;
  sentDate?: string;
  createdDate: string;
  updatedDate: string | null;
  recordingPersonnel?: string;
  createDate?: string;
  crmId?: string;
  activityType: CrmActivityTypeDto;
  activityTypeId: number;
  description: string;
  crmStatus?: CrmStatusDto | string | number | null;
  activityDate: string;
}


export interface CrmStatusHistoryDto {
  id: number;
  deal: CrmDealDto;
  dealId: number;
  previousStatus: CrmStatusDto;
  previousStatusId: number;
  newStatus: CrmStatusDto;
  newStatusId: number;
  notes: string;
  createdDate: string;
  status?: string;
}

export interface KanbanColumn {
  id: number;
  title: string;
  count: number;
  color: string;
  cards: CrmDealDto[];
}

// Define interface for email template
export interface EmailTemplateDto {
  id: number;
  templateName: string;
  subject: string;
  body: string;
  isActive: boolean;
}