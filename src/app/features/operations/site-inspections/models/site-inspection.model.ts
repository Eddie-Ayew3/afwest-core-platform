export type InspectionType = 'Routine' | 'Surprise' | 'FollowUp';
export type InspectionStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export interface SiteInspectionDto {
  id: string;
  siteId: string;
  siteName: string;
  inspectionType: string;
  scheduledDate: string;
  completedDate?: string;
  inspectorName?: string;
  findings?: string;
  recommendations?: string;
  status: string;
  overallScore?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateSiteInspectionDto {
  siteId: string;
  inspectionType: string;
  scheduledDate: string;
  inspectorName?: string;
  notes?: string;
}

export interface UpdateSiteInspectionDto {
  inspectorName?: string;
  findings?: string;
  recommendations?: string;
  overallScore?: number;
  notes?: string;
}
