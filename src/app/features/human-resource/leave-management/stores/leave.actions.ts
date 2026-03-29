import { createActionGroup, props } from '@ngrx/store';
import { LeaveRequestDto, CreateLeaveRequestDto, ApproveLeaveDto, LeaveBalanceDto, LeaveListParams, InitializeLeaveBalanceDto } from '../models/leave.model';

export const LeaveActions = createActionGroup({
  source: 'Leave',
  events: {
    'Load Leaves': props<{ params?: LeaveListParams }>(),
    'Load Leaves Success': props<{ leaves: LeaveRequestDto[] }>(),
    'Load Leaves Failure': props<{ error: string }>(),

    'Load Pending Leaves': props<Record<string, never>>(),
    'Load Pending Leaves Success': props<{ leaves: LeaveRequestDto[] }>(),
    'Load Pending Leaves Failure': props<{ error: string }>(),

    'Submit Leave': props<{ dto: CreateLeaveRequestDto }>(),
    'Submit Leave Success': props<{ leave: LeaveRequestDto }>(),
    'Submit Leave Failure': props<{ error: string }>(),

    'Approve Leave': props<{ id: string; dto: ApproveLeaveDto }>(),
    'Approve Leave Success': props<{ leave: LeaveRequestDto }>(),
    'Approve Leave Failure': props<{ error: string }>(),

    'Load Leave Balances': props<{ userId: string; year?: number }>(),
    'Load Leave Balances Success': props<{ balances: LeaveBalanceDto[] }>(),
    'Load Leave Balances Failure': props<{ error: string }>(),

    'Initialize Leave Balance': props<{ userId: string; dto: InitializeLeaveBalanceDto }>(),
    'Initialize Leave Balance Success': props<{ message: string }>(),
    'Initialize Leave Balance Failure': props<{ error: string }>(),

    'Auto Initialize Leave Balance': props<{ userId: string }>(),
    'Auto Initialize Leave Balance Success': props<{ message: string }>(),
    'Auto Initialize Leave Balance Failure': props<{ error: string }>(),
  }
});
