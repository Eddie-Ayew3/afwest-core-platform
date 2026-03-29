import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PettyCashActions } from './petty-cash.actions';
import { PettyCashService } from '../services/petty-cash.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class PettyCashEffects {
  private actions$ = inject(Actions);
  private pettyCashService = inject(PettyCashService);
  private toast = inject(ToastService);

  loadTransactions$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.loadTransactions),
    mergeMap(({ params }) => this.pettyCashService.getAll(params).pipe(
      map(result => PettyCashActions.loadTransactionsSuccess({ transactions: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(PettyCashActions.loadTransactionsFailure({ error: error.message })))
    ))
  ));

  loadTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.loadTransaction),
    mergeMap(({ id }) => this.pettyCashService.getById(id).pipe(
      map(transaction => PettyCashActions.loadTransactionSuccess({ transaction })),
      catchError(error => of(PettyCashActions.loadTransactionFailure({ error: error.message })))
    ))
  ));

  createTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.createTransaction),
    mergeMap(({ dto }) => this.pettyCashService.create(dto).pipe(
      map(transaction => {
        this.toast.show({ title: 'Success', description: 'Transaction submitted successfully.', variant: 'success' });
        return PettyCashActions.createTransactionSuccess({ transaction });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to submit transaction.', variant: 'destructive' });
        return of(PettyCashActions.createTransactionFailure({ error: error.message }));
      })
    ))
  ));

  approveTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.approveTransaction),
    mergeMap(({ id, dto }) => this.pettyCashService.approve(id, dto).pipe(
      map(transaction => {
        this.toast.show({ title: 'Approved', description: 'Transaction has been approved.', variant: 'success' });
        return PettyCashActions.approveTransactionSuccess({ transaction });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to approve transaction.', variant: 'destructive' });
        return of(PettyCashActions.approveTransactionFailure({ error: error.message }));
      })
    ))
  ));

  rejectTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.rejectTransaction),
    mergeMap(({ id }) => this.pettyCashService.reject(id).pipe(
      map(transaction => {
        this.toast.show({ title: 'Rejected', description: 'Transaction has been rejected.', variant: 'destructive' });
        return PettyCashActions.rejectTransactionSuccess({ transaction });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to reject transaction.', variant: 'destructive' });
        return of(PettyCashActions.rejectTransactionFailure({ error: error.message }));
      })
    ))
  ));

  deleteTransaction$ = createEffect(() => this.actions$.pipe(
    ofType(PettyCashActions.deleteTransaction),
    mergeMap(({ id }) => this.pettyCashService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Success', description: 'Transaction deleted successfully.', variant: 'success' });
        return PettyCashActions.deleteTransactionSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete transaction.', variant: 'destructive' });
        return of(PettyCashActions.deleteTransactionFailure({ error: error.message }));
      })
    ))
  ));
}
