import { createActionGroup, props } from '@ngrx/store';
import { PettyCashDto, CreatePettyCashDto, ApprovePettyCashDto, PettyCashListParams } from '../models/petty-cash.model';

export const PettyCashActions = createActionGroup({
  source: 'PettyCash',
  events: {
    'Load Transactions': props<{ params?: PettyCashListParams }>(),
    'Load Transactions Success': props<{ transactions: PettyCashDto[]; totalRecords: number }>(),
    'Load Transactions Failure': props<{ error: string }>(),

    'Load Transaction': props<{ id: string }>(),
    'Load Transaction Success': props<{ transaction: PettyCashDto }>(),
    'Load Transaction Failure': props<{ error: string }>(),

    'Create Transaction': props<{ dto: CreatePettyCashDto }>(),
    'Create Transaction Success': props<{ transaction: PettyCashDto }>(),
    'Create Transaction Failure': props<{ error: string }>(),

    'Approve Transaction': props<{ id: string; dto: ApprovePettyCashDto }>(),
    'Approve Transaction Success': props<{ transaction: PettyCashDto }>(),
    'Approve Transaction Failure': props<{ error: string }>(),

    'Reject Transaction': props<{ id: string }>(),
    'Reject Transaction Success': props<{ transaction: PettyCashDto }>(),
    'Reject Transaction Failure': props<{ error: string }>(),

    'Delete Transaction': props<{ id: string }>(),
    'Delete Transaction Success': props<{ id: string }>(),
    'Delete Transaction Failure': props<{ error: string }>(),
  }
});
