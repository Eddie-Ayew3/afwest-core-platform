import { createActionGroup, props } from '@ngrx/store';
import { IncidentDto, CreateIncidentDto, UpdateIncidentStatusDto, IncidentListParams } from '../models/incident.model';

export const IncidentActions = createActionGroup({
  source: 'Incident',
  events: {
    'Load Incidents': props<{ params?: IncidentListParams }>(),
    'Load Incidents Success': props<{ incidents: IncidentDto[]; totalRecords: number }>(),
    'Load Incidents Failure': props<{ error: string }>(),

    'Load Incident': props<{ id: string }>(),
    'Load Incident Success': props<{ incident: IncidentDto }>(),
    'Load Incident Failure': props<{ error: string }>(),

    'Create Incident': props<{ dto: CreateIncidentDto }>(),
    'Create Incident Success': props<{ incident: IncidentDto }>(),
    'Create Incident Failure': props<{ error: string }>(),

    'Update Incident Status': props<{ id: string; dto: UpdateIncidentStatusDto }>(),
    'Update Incident Status Success': props<{ incident: IncidentDto }>(),
    'Update Incident Status Failure': props<{ error: string }>(),

    'Delete Incident': props<{ id: string }>(),
    'Delete Incident Success': props<{ id: string }>(),
    'Delete Incident Failure': props<{ error: string }>(),
  }
});
