import { createReducer, on } from '@ngrx/store';
import { InvoiceActions } from './invoice.actions';
import { InvoiceDto } from '../models/invoice.model';

export interface InvoiceState {
  invoices: InvoiceDto[];
  selectedInvoice: InvoiceDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialInvoiceState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  saving: false,
  error: null,
};

export const invoiceReducer = createReducer(
  initialInvoiceState,

  // Load Invoices
  on(InvoiceActions.loadInvoices, state => ({ ...state, loading: true, error: null })),
  on(InvoiceActions.loadInvoicesSuccess, (state, { invoices }) => ({ ...state, loading: false, invoices })),
  on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Invoice
  on(InvoiceActions.createInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.createInvoiceSuccess, (state, { invoice }) => ({ ...state, saving: false, invoices: [...state.invoices, invoice] })),
  on(InvoiceActions.createInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Invoice
  on(InvoiceActions.updateInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.updateInvoiceSuccess, (state, { invoice }) => ({
    ...state,
    saving: false,
    invoices: state.invoices.map(i => i.id === invoice.id ? invoice : i),
  })),
  on(InvoiceActions.updateInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Invoice
  on(InvoiceActions.deleteInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.deleteInvoiceSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    invoices: state.invoices.filter(i => i.id !== id),
  })),
  on(InvoiceActions.deleteInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Send Invoice
  on(InvoiceActions.sendInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.sendInvoiceSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    invoices: state.invoices.map(i => i.id === id ? { ...i, statusName: 'Sent', status: 2 } : i),
  })),
  on(InvoiceActions.sendInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Pay Invoice
  on(InvoiceActions.payInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.payInvoiceSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    invoices: state.invoices.map(i => i.id === id ? { ...i, statusName: 'Paid', status: 3, paidAt: new Date().toISOString() } : i),
  })),
  on(InvoiceActions.payInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Cancel Invoice
  on(InvoiceActions.cancelInvoice, state => ({ ...state, saving: true, error: null })),
  on(InvoiceActions.cancelInvoiceSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    invoices: state.invoices.map(i => i.id === id ? { ...i, statusName: 'Cancelled', status: 5 } : i),
  })),
  on(InvoiceActions.cancelInvoiceFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
