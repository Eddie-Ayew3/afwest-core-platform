import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { GuardActions } from './guard.actions';
import { GuardService } from '../services/guard.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class GuardEffects {
  private actions$ = inject(Actions);
  private guardService = inject(GuardService);
  private toast = inject(ToastService);

  loadGuards$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.loadGuards),
    mergeMap(({ params }) => this.guardService.getAll(params).pipe(
      map(result => GuardActions.loadGuardsSuccess({ guards: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(GuardActions.loadGuardsFailure({ error: error.message })))
    ))
  ));

  loadGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.loadGuard),
    mergeMap(({ id }) => this.guardService.getById(id).pipe(
      map(guard => GuardActions.loadGuardSuccess({ guard })),
      catchError(error => of(GuardActions.loadGuardFailure({ error: error.message })))
    ))
  ));

  createGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.createGuard),
    mergeMap(({ dto }) => this.guardService.create(dto).pipe(
      map(guard => {
        this.toast.show({ title: 'Success', description: 'Guard registered successfully.', variant: 'success' });
        return GuardActions.createGuardSuccess({ guard });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to register guard.', variant: 'destructive' });
        return of(GuardActions.createGuardFailure({ error: error.message }));
      })
    ))
  ));

  updateGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.updateGuard),
    mergeMap(({ id, dto }) => this.guardService.update(id, dto).pipe(
      map(guard => {
        this.toast.show({ title: 'Success', description: 'Guard updated successfully.', variant: 'success' });
        return GuardActions.updateGuardSuccess({ guard });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update guard.', variant: 'destructive' });
        return of(GuardActions.updateGuardFailure({ error: error.message }));
      })
    ))
  ));

  approveGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.approveGuard),
    mergeMap(({ id }) => this.guardService.approve(id).pipe(
      map(guard => {
        this.toast.show({ title: 'Approved', description: 'Guard has been approved.', variant: 'success' });
        return GuardActions.approveGuardSuccess({ guard });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to approve guard.', variant: 'destructive' });
        return of(GuardActions.approveGuardFailure({ error: error.message }));
      })
    ))
  ));

  rejectGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.rejectGuard),
    mergeMap(({ id, reason }) => this.guardService.reject(id, { reason }).pipe(
      map(guard => {
        this.toast.show({ title: 'Rejected', description: 'Guard registration rejected.', variant: 'destructive' });
        return GuardActions.rejectGuardSuccess({ guard });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to reject guard.', variant: 'destructive' });
        return of(GuardActions.rejectGuardFailure({ error: error.message }));
      })
    ))
  ));

  deleteGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.deleteGuard),
    mergeMap(({ id }) => this.guardService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Success', description: 'Guard terminated.', variant: 'success' });
        return GuardActions.deleteGuardSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to terminate guard.', variant: 'destructive' });
        return of(GuardActions.deleteGuardFailure({ error: error.message }));
      })
    ))
  ));

  loadPerformance$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.loadGuardPerformance),
    mergeMap(({ id }) => this.guardService.getPerformance(id).pipe(
      map(performance => GuardActions.loadGuardPerformanceSuccess({ performance })),
      catchError(error => of(GuardActions.loadGuardPerformanceFailure({ error: error.message })))
    ))
  ));

  assignGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.assignGuard),
    mergeMap(({ id, dto }) => this.guardService.assign(id, dto).pipe(
      map(assignment => {
        this.toast.show({ title: 'Assigned', description: 'Guard assigned to site.', variant: 'success' });
        return GuardActions.assignGuardSuccess({ assignment });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to assign guard.', variant: 'destructive' });
        return of(GuardActions.assignGuardFailure({ error: error.message }));
      })
    ))
  ));

  transferGuard$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.transferGuard),
    mergeMap(({ id, dto }) => this.guardService.transfer(id, dto).pipe(
      map(assignment => {
        this.toast.show({ title: 'Transferred', description: 'Guard transferred to new site.', variant: 'success' });
        return GuardActions.transferGuardSuccess({ assignment });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to transfer guard.', variant: 'destructive' });
        return of(GuardActions.transferGuardFailure({ error: error.message }));
      })
    ))
  ));

  endGuardAssignment$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.endGuardAssignment),
    mergeMap(({ id, dto }) => this.guardService.endAssignment(id, dto).pipe(
      map(() => {
        this.toast.show({ title: 'Assignment Ended', description: 'Guard assignment has ended.', variant: 'success' });
        return GuardActions.endGuardAssignmentSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to end assignment.', variant: 'destructive' });
        return of(GuardActions.endGuardAssignmentFailure({ error: error.message }));
      })
    ))
  ));

  loadGuardAssignments$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.loadGuardAssignments),
    mergeMap(({ id }) => this.guardService.getAssignments(id).pipe(
      map(assignments => GuardActions.loadGuardAssignmentsSuccess({ assignments })),
      catchError(error => of(GuardActions.loadGuardAssignmentsFailure({ error: error.message })))
    ))
  ));

  submitPerformanceReview$ = createEffect(() => this.actions$.pipe(
    ofType(GuardActions.submitPerformanceReview),
    mergeMap(({ id, dto }) => this.guardService.submitPerformanceReview(id, dto).pipe(
      map(() => {
        this.toast.show({ title: 'Review Submitted', description: 'Performance review saved.', variant: 'success' });
        return GuardActions.submitPerformanceReviewSuccess({ message: 'Review recorded.' });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
        return of(GuardActions.submitPerformanceReviewFailure({ error: error.message }));
      })
    ))
  ));
}
