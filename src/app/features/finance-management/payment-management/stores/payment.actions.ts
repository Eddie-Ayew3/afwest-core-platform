import { createActionGroup, props } from '@ngrx/store';
import { PaymentDto, RecordPaymentDto, PaymentListParams } from '../models/payment.model';

export const PaymentActions = createActionGroup({
  source: 'Payment',
  events: {
    'Load Payments': props<{ params?: PaymentListParams }>(),
    'Load Payments Success': props<{ payments: PaymentDto[]; totalRecords: number }>(),
    'Load Payments Failure': props<{ error: string }>(),

    'Load Payment': props<{ id: string }>(),
    'Load Payment Success': props<{ payment: PaymentDto }>(),
    'Load Payment Failure': props<{ error: string }>(),

    'Record Payment': props<{ dto: RecordPaymentDto }>(),
    'Record Payment Success': props<{ payment: PaymentDto }>(),
    'Record Payment Failure': props<{ error: string }>(),

    'Delete Payment': props<{ id: string }>(),
    'Delete Payment Success': props<{ id: string }>(),
    'Delete Payment Failure': props<{ error: string }>(),
  }
});
