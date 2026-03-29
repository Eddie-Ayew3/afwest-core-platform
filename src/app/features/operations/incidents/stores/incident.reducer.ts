import { createReducer, on } from '@ngrx/store';
import { IncidentActions } from './incident.actions';
import { IncidentDto } from '../models/incident.model';

export interface IncidentState {
  incidents: IncidentDto[];
  selectedIncident: IncidentDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialIncidentState: IncidentState = {
  incidents: [],
  selectedIncident: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const incidentReducer = createReducer(
  initialIncidentState,

  on(IncidentActions.loadIncidents, state => ({ ...state, loading: true, error: null })),
  on(IncidentActions.loadIncidentsSuccess, (state, { incidents, totalRecords }) => ({ ...state, loading: false, incidents, totalRecords })),
  on(IncidentActions.loadIncidentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(IncidentActions.loadIncident, state => ({ ...state, loading: true, error: null })),
  on(IncidentActions.loadIncidentSuccess, (state, { incident }) => ({ ...state, loading: false, selectedIncident: incident })),
  on(IncidentActions.loadIncidentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(IncidentActions.createIncident, state => ({ ...state, saving: true, error: null })),
  on(IncidentActions.createIncidentSuccess, (state, { incident }) => ({
    ...state, saving: false,
    incidents: [incident, ...state.incidents],
    totalRecords: state.totalRecords + 1,
  })),
  on(IncidentActions.createIncidentFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(IncidentActions.updateIncidentStatus, state => ({ ...state, saving: true, error: null })),
  on(IncidentActions.updateIncidentStatusSuccess, (state, { incident }) => ({
    ...state, saving: false,
    incidents: state.incidents.map(i => i.id === incident.id ? incident : i),
    selectedIncident: state.selectedIncident?.id === incident.id ? incident : state.selectedIncident,
  })),
  on(IncidentActions.updateIncidentStatusFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(IncidentActions.deleteIncident, state => ({ ...state, saving: true, error: null })),
  on(IncidentActions.deleteIncidentSuccess, (state, { id }) => ({
    ...state, saving: false,
    incidents: state.incidents.filter(i => i.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(IncidentActions.deleteIncidentFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
