import { createActionGroup, props } from '@ngrx/store';
import { SlaRecordDto, SlaListParams } from '../models/sla-report.model';

export const SlaReportActions = createActionGroup({
  source: 'SlaReport',
  events: {
    'Load Sla Reports': props<{ params?: SlaListParams }>(),
    'Load Sla Reports Success': props<{ reports: SlaRecordDto[]; totalRecords: number }>(),
    'Load Sla Reports Failure': props<{ error: string }>(),

    'Load Sla Report': props<{ id: string }>(),
    'Load Sla Report Success': props<{ report: SlaRecordDto }>(),
    'Load Sla Report Failure': props<{ error: string }>(),
  }
});
