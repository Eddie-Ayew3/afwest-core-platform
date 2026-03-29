import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { IncidentActions } from './incident.actions';
import { IncidentService } from '../services/incident.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class IncidentEffects {
  private actions$ = inject(Actions);
  private incidentService = inject(IncidentService);
  private toast = inject(ToastService);

  loadIncidents$ = createEffect(() => this.actions$.pipe(
    ofType(IncidentActions.loadIncidents),
    mergeMap(({ params }) => this.incidentService.getAll(params).pipe(
      map(result => IncidentActions.loadIncidentsSuccess({ incidents: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(IncidentActions.loadIncidentsFailure({ error: error.message })))
    ))
  ));

  loadIncident$ = createEffect(() => this.actions$.pipe(
    ofType(IncidentActions.loadIncident),
    mergeMap(({ id }) => this.incidentService.getById(id).pipe(
      map(incident => IncidentActions.loadIncidentSuccess({ incident })),
      catchError(error => of(IncidentActions.loadIncidentFailure({ error: error.message })))
    ))
  ));

  createIncident$ = createEffect(() => this.actions$.pipe(
    ofType(IncidentActions.createIncident),
    mergeMap(({ dto }) => this.incidentService.create(dto).pipe(
      map(incident => {
        this.toast.show({ title: 'Incident Reported', description: `${incident.id} has been logged.`, variant: 'success' });
        return IncidentActions.createIncidentSuccess({ incident });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to report incident.', variant: 'destructive' });
        return of(IncidentActions.createIncidentFailure({ error: error.message }));
      })
    ))
  ));

  updateIncidentStatus$ = createEffect(() => this.actions$.pipe(
    ofType(IncidentActions.updateIncidentStatus),
    mergeMap(({ id, dto }) => this.incidentService.updateStatus(id, dto).pipe(
      map(incident => {
        this.toast.show({ title: 'Status Updated', description: `Incident marked as ${dto.status}.`, variant: 'success' });
        return IncidentActions.updateIncidentStatusSuccess({ incident });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update incident status.', variant: 'destructive' });
        return of(IncidentActions.updateIncidentStatusFailure({ error: error.message }));
      })
    ))
  ));

  deleteIncident$ = createEffect(() => this.actions$.pipe(
    ofType(IncidentActions.deleteIncident),
    mergeMap(({ id }) => this.incidentService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deleted', description: 'Incident report removed.', variant: 'destructive' });
        return IncidentActions.deleteIncidentSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete incident.', variant: 'destructive' });
        return of(IncidentActions.deleteIncidentFailure({ error: error.message }));
      })
    ))
  ));
}
