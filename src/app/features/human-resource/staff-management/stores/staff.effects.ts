import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { StaffActions } from './staff.actions';
import { StaffService } from '../services/staff.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class StaffEffects {
  private actions$ = inject(Actions);
  private staffService = inject(StaffService);
  private toast = inject(ToastService);

  loadStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.loadStaff),
    mergeMap(({ params }) => this.staffService.getAll(params).pipe(
      map(result => StaffActions.loadStaffSuccess({ staff: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(StaffActions.loadStaffFailure({ error: error.message })))
    ))
  ));

  loadStaffMember$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.loadStaffMember),
    mergeMap(({ id }) => this.staffService.getById(id).pipe(
      map(member => StaffActions.loadStaffMemberSuccess({ member })),
      catchError(error => of(StaffActions.loadStaffMemberFailure({ error: error.message })))
    ))
  ));

  createStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.createStaff),
    mergeMap(({ dto }) => this.staffService.create(dto).pipe(
      map(member => {
        this.toast.show({ title: 'Success', description: 'Staff member created.', variant: 'success' });
        return StaffActions.createStaffSuccess({ member });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to create staff.', variant: 'destructive' });
        return of(StaffActions.createStaffFailure({ error: error.message }));
      })
    ))
  ));

  updateStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.updateStaff),
    mergeMap(({ id, dto }) => this.staffService.update(id, dto).pipe(
      map(member => {
        this.toast.show({ title: 'Success', description: 'Staff member updated.', variant: 'success' });
        return StaffActions.updateStaffSuccess({ member });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update staff.', variant: 'destructive' });
        return of(StaffActions.updateStaffFailure({ error: error.message }));
      })
    ))
  ));

  deactivateStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.deactivateStaff),
    mergeMap(({ id }) => this.staffService.deactivate(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deactivated', description: 'Staff access revoked.', variant: 'destructive' });
        return StaffActions.deactivateStaffSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to deactivate staff.', variant: 'destructive' });
        return of(StaffActions.deactivateStaffFailure({ error: error.message }));
      })
    ))
  ));

  deleteStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.deleteStaff),
    mergeMap(({ id }) => this.staffService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deleted', description: 'Staff member removed.', variant: 'success' });
        return StaffActions.deleteStaffSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete staff.', variant: 'destructive' });
        return of(StaffActions.deleteStaffFailure({ error: error.message }));
      })
    ))
  ));

  activateStaff$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.activateStaff),
    mergeMap(({ id, dto }) => this.staffService.activate(id, dto).pipe(
      map(() => {
        this.toast.show({ title: 'Activated', description: 'Staff account activated.', variant: 'success' });
        return StaffActions.activateStaffSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to activate staff.', variant: 'destructive' });
        return of(StaffActions.activateStaffFailure({ error: error.message }));
      })
    ))
  ));

  assignRole$ = createEffect(() => this.actions$.pipe(
    ofType(StaffActions.assignRole),
    mergeMap(({ id, dto }) => this.staffService.assignRole(id, dto).pipe(
      map(() => {
        this.toast.show({ title: 'Role Assigned', description: 'Role has been assigned.', variant: 'success' });
        return StaffActions.assignRoleSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to assign role.', variant: 'destructive' });
        return of(StaffActions.assignRoleFailure({ error: error.message }));
      })
    ))
  ));
}
