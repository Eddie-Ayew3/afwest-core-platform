import { createReducer, on } from '@ngrx/store';
import { LeaveActions } from './leave.actions';
import { LeaveRequestDto, LeaveBalanceDto } from '../models/leave.model';

export interface LeaveState {
  leaves: LeaveRequestDto[];
  balances: LeaveBalanceDto[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialLeaveState: LeaveState = {
  leaves: [], balances: [],
  loading: false, saving: false, error: null,
};

export const leaveReducer = createReducer(
  initialLeaveState,

  on(LeaveActions.loadLeaves, state => ({ ...state, loading: true, error: null })),
  on(LeaveActions.loadLeavesSuccess, (state, { leaves }) => ({ ...state, loading: false, leaves })),
  on(LeaveActions.loadLeavesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LeaveActions.loadPendingLeaves, state => ({ ...state, loading: true, error: null })),
  on(LeaveActions.loadPendingLeavesSuccess, (state, { leaves }) => ({ ...state, loading: false, leaves })),
  on(LeaveActions.loadPendingLeavesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LeaveActions.submitLeave, state => ({ ...state, saving: true, error: null })),
  on(LeaveActions.submitLeaveSuccess, (state, { leave }) => ({ ...state, saving: false, leaves: [...state.leaves, leave] })),
  on(LeaveActions.submitLeaveFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(LeaveActions.approveLeave, state => ({ ...state, saving: true })),
  on(LeaveActions.approveLeaveSuccess, (state, { leave }) => ({
    ...state, saving: false,
    leaves: state.leaves.map(l => l.id === leave.id ? leave : l),
  })),
  on(LeaveActions.approveLeaveFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(LeaveActions.loadLeaveBalances, state => ({ ...state, loading: true })),
  on(LeaveActions.loadLeaveBalancesSuccess, (state, { balances }) => ({ ...state, loading: false, balances })),
  on(LeaveActions.loadLeaveBalancesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LeaveActions.initializeLeaveBalance, state => ({ ...state, saving: true })),
  on(LeaveActions.initializeLeaveBalanceSuccess, state => ({ ...state, saving: false })),
  on(LeaveActions.initializeLeaveBalanceFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(LeaveActions.autoInitializeLeaveBalance, state => ({ ...state, saving: true })),
  on(LeaveActions.autoInitializeLeaveBalanceSuccess, state => ({ ...state, saving: false })),
  on(LeaveActions.autoInitializeLeaveBalanceFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
