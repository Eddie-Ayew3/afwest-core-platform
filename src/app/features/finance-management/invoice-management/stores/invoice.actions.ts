import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InvoiceDto, CreateInvoiceDto, UpdateInvoiceDto } from '../models/invoice.model';

export const InvoiceActions = createActionGroup({
  source: 'Invoice',
  events: {
    'Load Invoices': props<{ params?: { pageNumber?: number; pageSize?: number } }>(),
    'Load Invoices Success': props<{ invoices: InvoiceDto[]; totalRecords: number }>(),
    'Load Invoices Failure': props<{ error: string }>(),

    'Create Invoice': props<{ dto: CreateInvoiceDto }>(),
    'Create Invoice Success': props<{ invoice: InvoiceDto }>(),
    'Create Invoice Failure': props<{ error: string }>(),

    'Update Invoice': props<{ id: string; dto: UpdateInvoiceDto }>(),
    'Update Invoice Success': props<{ invoice: InvoiceDto }>(),
    'Update Invoice Failure': props<{ error: string }>(),

    'Delete Invoice': props<{ id: string }>(),
    'Delete Invoice Success': props<{ id: string }>(),
    'Delete Invoice Failure': props<{ error: string }>(),

    'Send Invoice': props<{ id: string }>(),
    'Send Invoice Success': props<{ id: string }>(),
    'Send Invoice Failure': props<{ error: string }>(),

    'Pay Invoice': props<{ id: string }>(),
    'Pay Invoice Success': props<{ id: string }>(),
    'Pay Invoice Failure': props<{ error: string }>(),

    'Cancel Invoice': props<{ id: string }>(),
    'Cancel Invoice Success': props<{ id: string }>(),
    'Cancel Invoice Failure': props<{ error: string }>(),
  }
});
