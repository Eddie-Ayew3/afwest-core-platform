import { createActionGroup, props } from '@ngrx/store';
import { RegionDto, CreateRegionDto, UpdateRegionDto, AssignUserToRegionDto } from '../models/region.model';

export const RegionActions = createActionGroup({
  source: 'Region',
  events: {
    'Load Regions': props<{ params?: { pageNumber?: number; pageSize?: number; isActive?: boolean } }>(),
    'Load Regions Success': props<{ regions: RegionDto[]; totalRecords: number }>(),
    'Load Regions Failure': props<{ error: string }>(),

    'Create Region': props<{ dto: CreateRegionDto }>(),
    'Create Region Success': props<{ region: RegionDto }>(),
    'Create Region Failure': props<{ error: string }>(),

    'Update Region': props<{ id: string; dto: UpdateRegionDto }>(),
    'Update Region Success': props<{ region: RegionDto }>(),
    'Update Region Failure': props<{ error: string }>(),

    'Delete Region': props<{ id: string }>(),
    'Delete Region Success': props<{ id: string }>(),
    'Delete Region Failure': props<{ error: string }>(),

    'Assign User To Region': props<{ id: string; dto: AssignUserToRegionDto }>(),
    'Assign User To Region Success': props<Record<string, never>>(),
    'Assign User To Region Failure': props<{ error: string }>(),
  }
});
