import { createFeature, createSelector } from '@ngrx/store';
import { paymentReducer } from './payment.reducer';

export const paymentFeatureKey = 'payments';

export const {
  selectPaymentsState,
  selectPayments,
  selectSelectedPayment,
  selectTotalRecords: selectPaymentTotalCount,
  selectLoading: selectPaymentLoading,
  selectSaving: selectPaymentSaving,
  selectError: selectPaymentError,
} = createFeature({ name: paymentFeatureKey, reducer: paymentReducer });

export const selectOverduePayments = createSelector(selectPayments, payments => payments.filter(p => p.status === 'overdue'));
export const selectCompletedPayments = createSelector(selectPayments, payments => payments.filter(p => p.status === 'completed'));
