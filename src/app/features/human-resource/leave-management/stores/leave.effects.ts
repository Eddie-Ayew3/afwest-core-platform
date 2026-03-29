import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LeaveActions } from './leave.actions';
import { LeaveService } from '../services/leave.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class LeaveEffects {
  private actions$ = inject(Actions);
  private leaveService = inject(LeaveService);
  private toast = inject(ToastService);

  loadLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.loadLeaves),
    mergeMap(({ params }) => this.leaveService.getAll(params).pipe(
      map(leaves => LeaveActions.loadLeavesSuccess({ leaves })),
      catchError(error => of(LeaveActions.loadLeavesFailure({ error: error.message })))
    ))
  ));

  loadPendingLeaves$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.loadPendingLeaves),
    mergeMap(() => this.leaveService.getPending().pipe(
      map(leaves => LeaveActions.loadPendingLeavesSuccess({ leaves })),
      catchError(error => of(LeaveActions.loadPendingLeavesFailure({ error: error.message })))
    ))
  ));

  submitLeave$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.submitLeave),
    mergeMap(({ dto }) => this.leaveService.create(dto).pipe(
      map(leave => {
        this.toast.show({ title: 'Submitted', description: 'Leave request submitted.', variant: 'success' });
        return LeaveActions.submitLeaveSuccess({ leave });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to submit leave.', variant: 'destructive' });
        return of(LeaveActions.submitLeaveFailure({ error: error.message }));
      })
    ))
  ));

  approveLeave$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.approveLeave),
    mergeMap(({ id, dto }) => this.leaveService.approve(id, dto).pipe(
      map(leave => {
        const msg = dto.approved ? 'Leave approved.' : 'Leave rejected.';
        this.toast.show({ title: dto.approved ? 'Approved' : 'Rejected', description: msg, variant: dto.approved ? 'success' : 'destructive' });
        return LeaveActions.approveLeaveSuccess({ leave });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to process leave.', variant: 'destructive' });
        return of(LeaveActions.approveLeaveFailure({ error: error.message }));
      })
    ))
  ));

  loadLeaveBalances$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.loadLeaveBalances),
    mergeMap(({ userId, year }) => this.leaveService.getBalance(userId, year).pipe(
      map(balances => LeaveActions.loadLeaveBalancesSuccess({ balances })),
      catchError(error => of(LeaveActions.loadLeaveBalancesFailure({ error: error.message })))
    ))
  ));

  initializeLeaveBalance$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.initializeLeaveBalance),
    mergeMap(({ userId, dto }) => this.leaveService.initializeBalance(userId, dto).pipe(
      map(response => {
        this.toast.show({ title: 'Success', description: response.message, variant: 'success' });
        return LeaveActions.initializeLeaveBalanceSuccess({ message: response.message });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to initialize leave balance.', variant: 'destructive' });
        return of(LeaveActions.initializeLeaveBalanceFailure({ error: error.message }));
      })
    ))
  ));

  autoInitializeLeaveBalance$ = createEffect(() => this.actions$.pipe(
    ofType(LeaveActions.autoInitializeLeaveBalance),
    mergeMap(({ userId }) => this.leaveService.autoInitializeBalance(userId).pipe(
      map(response => {
        this.toast.show({ title: 'Success', description: response.message, variant: 'success' });
        return LeaveActions.autoInitializeLeaveBalanceSuccess({ message: response.message });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to auto-initialize leave balance.', variant: 'destructive' });
        return of(LeaveActions.autoInitializeLeaveBalanceFailure({ error: error.message }));
      })
    ))
  ));
}
