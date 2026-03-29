import { createActionGroup, props } from '@ngrx/store';
import { SiteInspectionDto, CreateSiteInspectionDto, UpdateSiteInspectionDto } from '../models/site-inspection.model';

export const SiteInspectionActions = createActionGroup({
  source: 'SiteInspection',
  events: {
    'Load Inspections': props<{ params?: { pageNumber?: number; pageSize?: number } }>(),
    'Load Inspections Success': props<{ inspections: SiteInspectionDto[]; totalRecords: number }>(),
    'Load Inspections Failure': props<{ error: string }>(),

    'Create Inspection': props<{ dto: CreateSiteInspectionDto }>(),
    'Create Inspection Success': props<{ inspection: SiteInspectionDto }>(),
    'Create Inspection Failure': props<{ error: string }>(),

    'Update Inspection': props<{ id: string; dto: UpdateSiteInspectionDto }>(),
    'Update Inspection Success': props<{ inspection: SiteInspectionDto }>(),
    'Update Inspection Failure': props<{ error: string }>(),

    'Delete Inspection': props<{ id: string }>(),
    'Delete Inspection Success': props<{ id: string }>(),
    'Delete Inspection Failure': props<{ error: string }>(),

    'Start Inspection': props<{ id: string }>(),
    'Start Inspection Success': props<{ id: string }>(),
    'Start Inspection Failure': props<{ error: string }>(),

    'Complete Inspection': props<{ id: string }>(),
    'Complete Inspection Success': props<{ id: string }>(),
    'Complete Inspection Failure': props<{ error: string }>(),

    'Cancel Inspection': props<{ id: string }>(),
    'Cancel Inspection Success': props<{ id: string }>(),
    'Cancel Inspection Failure': props<{ error: string }>(),
  }
});
