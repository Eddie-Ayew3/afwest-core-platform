import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
import { payrollReducer } from './payroll.reducer';

export const payrollFeatureKey = 'payroll';

export const {
  selectPayrollState,
  selectPayrollRecords,
  selectSelectedPayroll,
  selectLoading: selectPayrollLoading,
  selectSaving: selectPayrollSaving,
  selectError: selectPayrollError,
} = createFeature({
  name: payrollFeatureKey,
  reducer: payrollReducer,
});

export const selectPayrollByStatus = (status: string) =>
  createSelector(selectPayrollRecords, records => records.filter(p => p.statusName === status));

export const selectTotalPayrollAmount = createSelector(
  selectPayrollRecords,
  records => records.reduce((sum, p) => sum + p.netPay, 0)
);

export const selectProcessedPayroll = createSelector(
  selectPayrollRecords,
  records => records.filter(p => p.statusName === 'Processed')
);

export const selectPaidPayroll = createSelector(
  selectPayrollRecords,
  records => records.filter(p => p.statusName === 'Paid')
);
