import { createFeature, createSelector } from '@ngrx/store';
import { incidentReducer } from './incident.reducer';

export const incidentFeatureKey = 'incidents';

export const {
  selectIncidentsState,
  selectIncidents,
  selectSelectedIncident,
  selectTotalRecords: selectIncidentTotalCount,
  selectLoading: selectIncidentLoading,
  selectSaving: selectIncidentSaving,
  selectError: selectIncidentError,
} = createFeature({ name: incidentFeatureKey, reducer: incidentReducer });

export const selectOpenIncidents = createSelector(
  selectIncidents,
  incidents => incidents.filter(i => i.status === 'Open')
);

export const selectHighSeverityIncidents = createSelector(
  selectIncidents,
  incidents => incidents.filter(i => i.severity === 'High')
);
