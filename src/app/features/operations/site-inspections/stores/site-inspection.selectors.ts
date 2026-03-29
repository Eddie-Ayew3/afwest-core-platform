import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
import { SiteInspectionDto } from '../models/site-inspection.model';
import { siteInspectionReducer } from './site-inspection.reducer';

export const siteInspectionFeatureKey = 'siteInspections';

export const {
  selectSiteInspectionsState,
  selectInspections: selectSiteInspections,
  selectSelectedInspection: selectSelectedSiteInspection,
  selectLoading: selectSiteInspectionLoading,
  selectSaving: selectSiteInspectionSaving,
  selectError: selectSiteInspectionError,
} = createFeature({
  name: siteInspectionFeatureKey,
  reducer: siteInspectionReducer,
});

export const selectInspectionsByStatus = (status: string) =>
  createSelector(selectSiteInspections, (inspections: SiteInspectionDto[]) => inspections.filter(i => i.status === status));

export const selectInspectionsByType = (type: string) =>
  createSelector(selectSiteInspections, (inspections: SiteInspectionDto[]) => inspections.filter(i => i.inspectionType === type));

export const selectCompletedInspections = createSelector(
  selectSiteInspections,
  (inspections: SiteInspectionDto[]) => inspections.filter(i => i.status === 'Completed')
);

export const selectPendingInspections = createSelector(
  selectSiteInspections,
  (inspections: SiteInspectionDto[]) => inspections.filter(i => i.status === 'Scheduled')
);
