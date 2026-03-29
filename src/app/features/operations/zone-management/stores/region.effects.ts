import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RegionActions } from './region.actions';
import { RegionService } from '../services/region.service';
import { AssignUserToRegionDto } from '../models/region.model';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class RegionEffects {
  private readonly actions$ = inject(Actions);
  private readonly regionService = inject(RegionService);
  private readonly toast = inject(ToastService);

  loadRegions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.loadRegions),
      mergeMap(({ params }) =>
        this.regionService.getAll(params).pipe(
          map(result => RegionActions.loadRegionsSuccess({ 
            regions: result.data, 
            totalRecords: result.totalRecords 
          })),
          catchError(error => of(RegionActions.loadRegionsFailure({ error: error.message })))
        )
      )
    )
  );

  createRegion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.createRegion),
      mergeMap(({ dto }) =>
        this.regionService.create(dto).pipe(
          map(region => {
            this.toast.show({ title: 'Success', description: 'Region created successfully.', variant: 'success' });
            return RegionActions.createRegionSuccess({ region });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to create region.', variant: 'destructive' });
            return of(RegionActions.createRegionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateRegion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.updateRegion),
      mergeMap(({ id, dto }) =>
        this.regionService.update(id, dto).pipe(
          map(region => {
            this.toast.show({ title: 'Success', description: 'Region updated successfully.', variant: 'success' });
            return RegionActions.updateRegionSuccess({ region });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update region.', variant: 'destructive' });
            return of(RegionActions.updateRegionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteRegion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.deleteRegion),
      mergeMap(({ id }) =>
        this.regionService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Region deleted successfully.', variant: 'success' });
            return RegionActions.deleteRegionSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete region.', variant: 'destructive' });
            return of(RegionActions.deleteRegionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  assignUserToRegion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.assignUserToRegion),
      mergeMap(({ id, dto }) =>
        this.regionService.assignUser(id, dto).pipe(
          map(() => {
            this.toast.show({ title: 'User Assigned', description: 'User has been assigned to region.', variant: 'success' });
            return RegionActions.assignUserToRegionSuccess({});
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to assign user.', variant: 'destructive' });
            return of(RegionActions.assignUserToRegionFailure({ error: error.message }));
          })
        )
      )
    )
  );

  assignUserToRegionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegionActions.assignUserToRegionSuccess),
      map(() => RegionActions.loadRegions({ params: { pageNumber: 1, pageSize: 50 } }))
    )
  );
}
