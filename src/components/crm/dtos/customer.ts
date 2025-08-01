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
  status?: CrmStatusDto;
  statusId?: number;
  value?: string;
  createdDate?: string;
  updatedDate?: string | null;
  createdBy?: string | null;
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
}

export interface KanbanColumn {
  id: number;
  title: string;
  count: number;
  color: string;
  cards: CrmDealDto[];
}