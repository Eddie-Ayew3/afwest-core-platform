import { createFeature, createSelector } from '@ngrx/store';
import { leaveReducer } from './leave.reducer';

export const leaveFeatureKey = 'leave';

export const {
  selectLeaveState,
  selectLeaves,
  selectBalances,
  selectLoading: selectLeaveLoading,
  selectSaving: selectLeaveSaving,
  selectError: selectLeaveError,
} = createFeature({ name: leaveFeatureKey, reducer: leaveReducer });

export const selectPendingLeaves = createSelector(selectLeaves, leaves => leaves.filter(l => l.status === 'Pending'));
export const selectApprovedLeaves = createSelector(selectLeaves, leaves => leaves.filter(l => l.status === 'Approved'));
