export interface CustomerDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface ServiceTypeDto {
  id: number;
  name: string;
}

export interface CrmStatusDto {
  id: number;
  statusName: string;
}

export interface CrmDealDto {
  id: number;
  cRMRefNo: string;
  customer: CustomerDto;
  customerId: number;
  serviceType: ServiceTypeDto;
  serviceTypeId: number;
  assignedEmployeeId: number;
  status: CrmStatusDto;
  statusId: number;
  createdDate: string;
  updatedDate: string | null;
  value?: string;
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