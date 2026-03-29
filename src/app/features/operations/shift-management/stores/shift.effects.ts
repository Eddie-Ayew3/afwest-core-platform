import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, of, tap } from 'rxjs';
import { ShiftActions } from './shift.actions';
import { ShiftService } from '../services/shift.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class ShiftEffects {
  private readonly actions$ = inject(Actions);
  private readonly shiftService = inject(ShiftService);
  private readonly toast = inject(ToastService);

  loadShifts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.loadShifts),
      mergeMap(({ params }) =>
        this.shiftService.getAll(params).pipe(
          map(response => ShiftActions.loadShiftsSuccess({ shifts: response.data, totalRecords: response.totalRecords })),
          catchError(error => of(ShiftActions.loadShiftsFailure({ error: error.message })))
        )
      )
    )
  );

  createShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.createShift),
      mergeMap(({ dto }) =>
        this.shiftService.create(dto).pipe(
          map(shift => {
            this.toast.show({ title: 'Success', description: 'Shift created successfully.', variant: 'success' });
            return ShiftActions.createShiftSuccess({ shift });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to create shift.', variant: 'destructive' });
            return of(ShiftActions.createShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.updateShift),
      mergeMap(({ id, dto }) =>
        this.shiftService.update(id, dto).pipe(
          map(shift => {
            this.toast.show({ title: 'Success', description: 'Shift updated successfully.', variant: 'success' });
            return ShiftActions.updateShiftSuccess({ shift });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update shift.', variant: 'destructive' });
            return of(ShiftActions.updateShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.deleteShift),
      mergeMap(({ id }) =>
        this.shiftService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Shift deleted successfully.', variant: 'success' });
            return ShiftActions.deleteShiftSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete shift.', variant: 'destructive' });
            return of(ShiftActions.deleteShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  startShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.startShift),
      mergeMap(({ id }) =>
        this.shiftService.startShift(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Shift started successfully.', variant: 'success' });
            return ShiftActions.startShiftSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to start shift.', variant: 'destructive' });
            return of(ShiftActions.startShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  completeShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.completeShift),
      mergeMap(({ id }) =>
        this.shiftService.completeShift(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Shift completed successfully.', variant: 'success' });
            return ShiftActions.completeShiftSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to complete shift.', variant: 'destructive' });
            return of(ShiftActions.completeShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  cancelShift$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.cancelShift),
      mergeMap(({ id, reason }) =>
        this.shiftService.cancelShift(id, reason).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Shift cancelled successfully.', variant: 'success' });
            return ShiftActions.cancelShiftSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to cancel shift.', variant: 'destructive' });
            return of(ShiftActions.cancelShiftFailure({ error: error.message }));
          })
        )
      )
    )
  );

  markMissed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.markMissed),
      mergeMap(({ id, reason }) =>
        this.shiftService.markMissed(id, reason).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Shift marked as missed.', variant: 'success' });
            return ShiftActions.markMissedSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to mark shift as missed.', variant: 'destructive' });
            return of(ShiftActions.markMissedFailure({ error: error.message }));
          })
        )
      )
    )
  );

  manualCheckIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.manualCheckIn),
      mergeMap(({ id, dto }) =>
        this.shiftService.manualCheckIn(id, dto).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Manual check-in recorded.', variant: 'success' });
            return ShiftActions.manualCheckInSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to record check-in.', variant: 'destructive' });
            return of(ShiftActions.manualCheckInFailure({ error: error.message }));
          })
        )
      )
    )
  );

  manualCheckOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShiftActions.manualCheckOut),
      mergeMap(({ id, dto }) =>
        this.shiftService.manualCheckOut(id, dto).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Manual check-out recorded.', variant: 'success' });
            return ShiftActions.manualCheckOutSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to record check-out.', variant: 'destructive' });
            return of(ShiftActions.manualCheckOutFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
