import { createFeature, createSelector } from '@ngrx/store';
import { staffReducer } from './staff.reducer';

export const staffFeatureKey = 'staff';

export const {
  selectStaffState,
  selectStaff,
  selectSelectedMember,
  selectTotalRecords: selectStaffTotalCount,
  selectLoading: selectStaffLoading,
  selectSaving: selectStaffSaving,
  selectError: selectStaffError,
} = createFeature({ name: staffFeatureKey, reducer: staffReducer });

export const selectActiveStaff = createSelector(selectStaff, staff => staff.filter(s => s.isActive));
