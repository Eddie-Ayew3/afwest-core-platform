import { createReducer, on } from '@ngrx/store';
import { PaymentActions } from './payment.actions';
import { PaymentDto } from '../models/payment.model';

export interface PaymentState {
  payments: PaymentDto[];
  selectedPayment: PaymentDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialPaymentState: PaymentState = {
  payments: [],
  selectedPayment: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const paymentReducer = createReducer(
  initialPaymentState,

  on(PaymentActions.loadPayments, state => ({ ...state, loading: true, error: null })),
  on(PaymentActions.loadPaymentsSuccess, (state, { payments, totalRecords }) => ({ ...state, loading: false, payments, totalRecords })),
  on(PaymentActions.loadPaymentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PaymentActions.loadPayment, state => ({ ...state, loading: true })),
  on(PaymentActions.loadPaymentSuccess, (state, { payment }) => ({ ...state, loading: false, selectedPayment: payment })),
  on(PaymentActions.loadPaymentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PaymentActions.recordPayment, state => ({ ...state, saving: true, error: null })),
  on(PaymentActions.recordPaymentSuccess, (state, { payment }) => ({
    ...state, saving: false,
    payments: [...state.payments, payment],
    totalRecords: state.totalRecords + 1,
  })),
  on(PaymentActions.recordPaymentFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PaymentActions.deletePayment, state => ({ ...state, saving: true })),
  on(PaymentActions.deletePaymentSuccess, (state, { id }) => ({
    ...state, saving: false,
    payments: state.payments.filter(p => p.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(PaymentActions.deletePaymentFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
