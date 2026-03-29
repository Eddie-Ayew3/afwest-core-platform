import { createFeature, createSelector } from '@ngrx/store';
import { slaReportReducer } from './sla-report.reducer';

export const slaReportFeatureKey = 'slaReports';

export const {
  selectSlaReportState,
  selectReports,
  selectSelectedReport,
  selectTotalRecords: selectSlaTotalCount,
  selectLoading: selectSlaLoading,
  selectError: selectSlaError,
} = createFeature({ name: slaReportFeatureKey, reducer: slaReportReducer });

export const selectCompliantReports = createSelector(selectReports, reports => reports.filter(r => r.status === 'Compliant'));
export const selectBreachedReports = createSelector(selectReports, reports => reports.filter(r => r.status === 'Breached'));
