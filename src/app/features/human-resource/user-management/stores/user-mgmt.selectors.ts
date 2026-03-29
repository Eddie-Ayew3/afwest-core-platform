import { createFeature, createSelector } from '@ngrx/store';
import { userMgmtReducer } from './user-mgmt.reducer';

export const userMgmtFeatureKey = 'userMgmt';

export const {
  selectUserMgmtState,
  selectUsers,
  selectAccessList,
  selectTotalRecords: selectUserTotalCount,
  selectLoading: selectUserLoading,
  selectSaving: selectUserSaving,
  selectError: selectUserError,
} = createFeature({ name: userMgmtFeatureKey, reducer: userMgmtReducer });

export const selectActiveUsers = createSelector(selectUsers, users => users.filter(u => u.isActive));
