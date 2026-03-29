import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SiteInspectionActions } from './site-inspection.actions';
import { SiteInspectionService } from '../services/site-inspection.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class SiteInspectionEffects {
  private readonly actions$ = inject(Actions);
  private readonly siteInspectionService = inject(SiteInspectionService);
  private readonly toast = inject(ToastService);

  loadInspections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.loadInspections),
      mergeMap(({ params }) =>
        this.siteInspectionService.getAll(params).pipe(
          map(response => SiteInspectionActions.loadInspectionsSuccess({ inspections: response.data, totalRecords: response.totalRecords })),
          catchError(error => of(SiteInspectionActions.loadInspectionsFailure({ error: error.message })))
        )
      )
    )
  );

  createInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.createInspection),
      mergeMap(({ dto }) =>
        this.siteInspectionService.create(dto).pipe(
          map(inspection => {
            this.toast.show({ title: 'Success', description: 'Inspection scheduled successfully.', variant: 'success' });
            return SiteInspectionActions.createInspectionSuccess({ inspection });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to schedule inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.createInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.updateInspection),
      mergeMap(({ id, dto }) =>
        this.siteInspectionService.update(id, dto).pipe(
          map(inspection => {
            this.toast.show({ title: 'Success', description: 'Inspection updated successfully.', variant: 'success' });
            return SiteInspectionActions.updateInspectionSuccess({ inspection });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.updateInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.deleteInspection),
      mergeMap(({ id }) =>
        this.siteInspectionService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Inspection deleted successfully.', variant: 'success' });
            return SiteInspectionActions.deleteInspectionSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.deleteInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  startInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.startInspection),
      mergeMap(({ id }) =>
        this.siteInspectionService.startInspection(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Inspection started.', variant: 'success' });
            return SiteInspectionActions.startInspectionSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to start inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.startInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  completeInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.completeInspection),
      mergeMap(({ id }) =>
        this.siteInspectionService.completeInspection(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Inspection completed.', variant: 'success' });
            return SiteInspectionActions.completeInspectionSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to complete inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.completeInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  cancelInspection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SiteInspectionActions.cancelInspection),
      mergeMap(({ id }) =>
        this.siteInspectionService.cancelInspection(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Inspection cancelled.', variant: 'success' });
            return SiteInspectionActions.cancelInspectionSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to cancel inspection.', variant: 'destructive' });
            return of(SiteInspectionActions.cancelInspectionFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
