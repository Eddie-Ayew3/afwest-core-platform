import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { InvoiceActions } from './invoice.actions';
import { InvoiceService } from '../services/invoice.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class InvoiceEffects {
  private readonly actions$ = inject(Actions);
  private readonly invoiceService = inject(InvoiceService);
  private readonly toast = inject(ToastService);

  loadInvoices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.loadInvoices),
      mergeMap(({ params }) =>
        this.invoiceService.getAll(params).pipe(
          map(response => InvoiceActions.loadInvoicesSuccess({ invoices: response.data, totalRecords: response.totalRecords })),
          catchError(error => of(InvoiceActions.loadInvoicesFailure({ error: error.message })))
        )
      )
    )
  );

  createInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.createInvoice),
      mergeMap(({ dto }) =>
        this.invoiceService.create(dto).pipe(
          map(invoice => {
            this.toast.show({ title: 'Success', description: 'Invoice created successfully.', variant: 'success' });
            return InvoiceActions.createInvoiceSuccess({ invoice });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to create invoice.', variant: 'destructive' });
            return of(InvoiceActions.createInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.updateInvoice),
      mergeMap(({ id, dto }) =>
        this.invoiceService.update(id, dto).pipe(
          map(invoice => {
            this.toast.show({ title: 'Success', description: 'Invoice updated successfully.', variant: 'success' });
            return InvoiceActions.updateInvoiceSuccess({ invoice });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update invoice.', variant: 'destructive' });
            return of(InvoiceActions.updateInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.deleteInvoice),
      mergeMap(({ id }) =>
        this.invoiceService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Invoice deleted successfully.', variant: 'success' });
            return InvoiceActions.deleteInvoiceSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete invoice.', variant: 'destructive' });
            return of(InvoiceActions.deleteInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );

  sendInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.sendInvoice),
      mergeMap(({ id }) =>
        this.invoiceService.sendInvoice(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Invoice sent successfully.', variant: 'success' });
            return InvoiceActions.sendInvoiceSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to send invoice.', variant: 'destructive' });
            return of(InvoiceActions.sendInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );

  payInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.payInvoice),
      mergeMap(({ id }) =>
        this.invoiceService.payInvoice(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Invoice payment recorded.', variant: 'success' });
            return InvoiceActions.payInvoiceSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to record payment.', variant: 'destructive' });
            return of(InvoiceActions.payInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );

  cancelInvoice$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InvoiceActions.cancelInvoice),
      mergeMap(({ id }) =>
        this.invoiceService.cancelInvoice(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Invoice cancelled successfully.', variant: 'success' });
            return InvoiceActions.cancelInvoiceSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to cancel invoice.', variant: 'destructive' });
            return of(InvoiceActions.cancelInvoiceFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
