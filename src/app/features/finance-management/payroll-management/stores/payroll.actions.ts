import { createActionGroup, props } from '@ngrx/store';
import { PayrollRecordDto, CreatePayrollRecordDto, UpdatePayrollRecordDto } from '../models/payroll.model';

export const PayrollActions = createActionGroup({
  source: 'Payroll',
  events: {
    'Load Payroll Records': props<{ params?: { pageNumber?: number; pageSize?: number } }>(),
    'Load Payroll Records Success': props<{ payrollRecords: PayrollRecordDto[]; totalRecords: number }>(),
    'Load Payroll Records Failure': props<{ error: string }>(),

    'Create Payroll Record': props<{ dto: CreatePayrollRecordDto }>(),
    'Create Payroll Record Success': props<{ payrollRecord: PayrollRecordDto }>(),
    'Create Payroll Record Failure': props<{ error: string }>(),

    'Update Payroll Record': props<{ id: string; dto: UpdatePayrollRecordDto }>(),
    'Update Payroll Record Success': props<{ payrollRecord: PayrollRecordDto }>(),
    'Update Payroll Record Failure': props<{ error: string }>(),

    'Delete Payroll Record': props<{ id: string }>(),
    'Delete Payroll Record Success': props<{ id: string }>(),
    'Delete Payroll Record Failure': props<{ error: string }>(),

    'Process Payroll': props<{ id: string }>(),
    'Process Payroll Success': props<{ id: string }>(),
    'Process Payroll Failure': props<{ error: string }>(),

    'Pay Payroll': props<{ id: string }>(),
    'Pay Payroll Success': props<{ id: string }>(),
    'Pay Payroll Failure': props<{ error: string }>(),
  }
});
