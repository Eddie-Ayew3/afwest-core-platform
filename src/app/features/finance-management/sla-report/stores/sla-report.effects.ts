import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SlaReportActions } from './sla-report.actions';
import { SlaReportService } from '../services/sla-report.service';

@Injectable()
export class SlaReportEffects {
  private actions$ = inject(Actions);
  private slaReportService = inject(SlaReportService);

  loadSlaReports$ = createEffect(() => this.actions$.pipe(
    ofType(SlaReportActions.loadSlaReports),
    mergeMap(({ params }) => this.slaReportService.getAll(params).pipe(
      map(result => SlaReportActions.loadSlaReportsSuccess({ reports: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(SlaReportActions.loadSlaReportsFailure({ error: error.message })))
    ))
  ));

  loadSlaReport$ = createEffect(() => this.actions$.pipe(
    ofType(SlaReportActions.loadSlaReport),
    mergeMap(({ id }) => this.slaReportService.getById(id).pipe(
      map(report => SlaReportActions.loadSlaReportSuccess({ report })),
      catchError(error => of(SlaReportActions.loadSlaReportFailure({ error: error.message })))
    ))
  ));
}
