import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
import { invoiceReducer } from './invoice.reducer';

export const invoiceFeatureKey = 'invoices';

export const {
  selectInvoicesState,
  selectInvoices,
  selectSelectedInvoice,
  selectLoading: selectInvoiceLoading,
  selectSaving: selectInvoiceSaving,
  selectError: selectInvoiceError,
} = createFeature({
  name: invoiceFeatureKey,
  reducer: invoiceReducer,
});

export const selectInvoicesByStatus = (status: string) =>
  createSelector(selectInvoices, invoices => invoices.filter(i => i.statusName === status));

export const selectTotalInvoiceAmount = createSelector(
  selectInvoices,
  invoices => invoices.reduce((sum, i) => sum + i.totalAmount, 0)
);

export const selectPaidInvoices = createSelector(
  selectInvoices,
  invoices => invoices.filter(i => i.statusName === 'Paid')
);

export const selectOverdueInvoices = createSelector(
  selectInvoices,
  invoices => invoices.filter(i => i.statusName === 'Overdue')
);
