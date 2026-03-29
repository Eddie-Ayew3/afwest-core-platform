import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PayrollActions } from './payroll.actions';
import { PayrollService } from '../services/payroll.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class PayrollEffects {
  private readonly actions$ = inject(Actions);
  private readonly payrollService = inject(PayrollService);
  private readonly toast = inject(ToastService);

  loadPayrollRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.loadPayrollRecords),
      mergeMap(({ params }) =>
        this.payrollService.getAll(params).pipe(
          map(response => PayrollActions.loadPayrollRecordsSuccess({ payrollRecords: response.data, totalRecords: response.totalRecords })),
          catchError(error => of(PayrollActions.loadPayrollRecordsFailure({ error: error.message })))
        )
      )
    )
  );

  createPayrollRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.createPayrollRecord),
      mergeMap(({ dto }) =>
        this.payrollService.create(dto).pipe(
          map(payroll => {
            this.toast.show({ title: 'Success', description: 'Payroll record created successfully.', variant: 'success' });
            return PayrollActions.createPayrollRecordSuccess({ payrollRecord: payroll });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to create payroll record.', variant: 'destructive' });
            return of(PayrollActions.createPayrollRecordFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updatePayrollRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.updatePayrollRecord),
      mergeMap(({ id, dto }) =>
        this.payrollService.update(id, dto).pipe(
          map(payroll => {
            this.toast.show({ title: 'Success', description: 'Payroll record updated successfully.', variant: 'success' });
            return PayrollActions.updatePayrollRecordSuccess({ payrollRecord: payroll });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update payroll record.', variant: 'destructive' });
            return of(PayrollActions.updatePayrollRecordFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deletePayrollRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.deletePayrollRecord),
      mergeMap(({ id }) =>
        this.payrollService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Payroll record deleted successfully.', variant: 'success' });
            return PayrollActions.deletePayrollRecordSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete payroll record.', variant: 'destructive' });
            return of(PayrollActions.deletePayrollRecordFailure({ error: error.message }));
          })
        )
      )
    )
  );

  processPayroll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.processPayroll),
      mergeMap(({ id }) =>
        this.payrollService.processPayroll(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Payroll processed successfully.', variant: 'success' });
            return PayrollActions.processPayrollSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to process payroll.', variant: 'destructive' });
            return of(PayrollActions.processPayrollFailure({ error: error.message }));
          })
        )
      )
    )
  );

  payPayroll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PayrollActions.payPayroll),
      mergeMap(({ id }) =>
        this.payrollService.payPayroll(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Payroll payment recorded.', variant: 'success' });
            return PayrollActions.payPayrollSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to record payroll payment.', variant: 'destructive' });
            return of(PayrollActions.payPayrollFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
