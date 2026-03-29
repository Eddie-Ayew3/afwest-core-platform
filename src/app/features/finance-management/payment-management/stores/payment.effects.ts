import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PaymentActions } from './payment.actions';
import { PaymentService } from '../services/payment.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class PaymentEffects {
  private actions$ = inject(Actions);
  private paymentService = inject(PaymentService);
  private toast = inject(ToastService);

  loadPayments$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.loadPayments),
    mergeMap(({ params }) => this.paymentService.getAll(params).pipe(
      map(result => PaymentActions.loadPaymentsSuccess({ payments: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(PaymentActions.loadPaymentsFailure({ error: error.message })))
    ))
  ));

  loadPayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.loadPayment),
    mergeMap(({ id }) => this.paymentService.getById(id).pipe(
      map(payment => PaymentActions.loadPaymentSuccess({ payment })),
      catchError(error => of(PaymentActions.loadPaymentFailure({ error: error.message })))
    ))
  ));

  recordPayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.recordPayment),
    mergeMap(({ dto }) => this.paymentService.record(dto).pipe(
      map(payment => {
        this.toast.show({ title: 'Success', description: 'Payment recorded successfully.', variant: 'success' });
        return PaymentActions.recordPaymentSuccess({ payment });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to record payment.', variant: 'destructive' });
        return of(PaymentActions.recordPaymentFailure({ error: error.message }));
      })
    ))
  ));

  deletePayment$ = createEffect(() => this.actions$.pipe(
    ofType(PaymentActions.deletePayment),
    mergeMap(({ id }) => this.paymentService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Success', description: 'Payment deleted successfully.', variant: 'success' });
        return PaymentActions.deletePaymentSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete payment.', variant: 'destructive' });
        return of(PaymentActions.deletePaymentFailure({ error: error.message }));
      })
    ))
  ));
}
