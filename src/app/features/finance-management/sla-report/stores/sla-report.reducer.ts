import { createReducer, on } from '@ngrx/store';
import { SlaReportActions } from './sla-report.actions';
import { SlaRecordDto } from '../models/sla-report.model';

export interface SlaReportState {
  reports: SlaRecordDto[];
  selectedReport: SlaRecordDto | null;
  totalRecords: number;
  loading: boolean;
  error: string | null;
}

export const initialSlaReportState: SlaReportState = {
  reports: [],
  selectedReport: null,
  totalRecords: 0,
  loading: false,
  error: null,
};

export const slaReportReducer = createReducer(
  initialSlaReportState,

  on(SlaReportActions.loadSlaReports, state => ({ ...state, loading: true, error: null })),
  on(SlaReportActions.loadSlaReportsSuccess, (state, { reports, totalRecords }) => ({ ...state, loading: false, reports, totalRecords })),
  on(SlaReportActions.loadSlaReportsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(SlaReportActions.loadSlaReport, state => ({ ...state, loading: true })),
  on(SlaReportActions.loadSlaReportSuccess, (state, { report }) => ({ ...state, loading: false, selectedReport: report })),
  on(SlaReportActions.loadSlaReportFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
