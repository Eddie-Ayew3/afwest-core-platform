import { createReducer, on } from '@ngrx/store';
import { PayrollActions } from './payroll.actions';
import { PayrollRecordDto } from '../models/payroll.model';

export interface PayrollState {
  payrollRecords: PayrollRecordDto[];
  selectedPayroll: PayrollRecordDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialPayrollState: PayrollState = {
  payrollRecords: [],
  selectedPayroll: null,
  loading: false,
  saving: false,
  error: null,
};

export const payrollReducer = createReducer(
  initialPayrollState,

  // Load Payroll
  on(PayrollActions.loadPayrollRecords, state => ({ ...state, loading: true, error: null })),
  on(PayrollActions.loadPayrollRecordsSuccess, (state, { payrollRecords }) => ({ ...state, loading: false, payrollRecords })),
  on(PayrollActions.loadPayrollRecordsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Payroll
  on(PayrollActions.createPayrollRecord, state => ({ ...state, saving: true, error: null })),
  on(PayrollActions.createPayrollRecordSuccess, (state, { payrollRecord }) => ({ ...state, saving: false, payrollRecords: [...state.payrollRecords, payrollRecord] })),
  on(PayrollActions.createPayrollRecordFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Payroll
  on(PayrollActions.updatePayrollRecord, state => ({ ...state, saving: true, error: null })),
  on(PayrollActions.updatePayrollRecordSuccess, (state, { payrollRecord }) => ({
    ...state,
    saving: false,
    payrollRecords: state.payrollRecords.map(p => p.id === payrollRecord.id ? payrollRecord : p),
  })),
  on(PayrollActions.updatePayrollRecordFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Payroll
  on(PayrollActions.deletePayrollRecord, state => ({ ...state, saving: true, error: null })),
  on(PayrollActions.deletePayrollRecordSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    payrollRecords: state.payrollRecords.filter(p => p.id !== id),
  })),
  on(PayrollActions.deletePayrollRecordFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Process Payroll
  on(PayrollActions.processPayroll, state => ({ ...state, saving: true, error: null })),
  on(PayrollActions.processPayrollSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    payrollRecords: state.payrollRecords.map(p => p.id === id ? { ...p, statusName: 'Processed', status: 2, processedAt: new Date().toISOString() } : p),
  })),
  on(PayrollActions.processPayrollFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Pay Payroll
  on(PayrollActions.payPayroll, state => ({ ...state, saving: true, error: null })),
  on(PayrollActions.payPayrollSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    payrollRecords: state.payrollRecords.map(p => p.id === id ? { ...p, statusName: 'Paid', status: 3, paidAt: new Date().toISOString() } : p),
  })),
  on(PayrollActions.payPayrollFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
