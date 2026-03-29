import { createFeature, createFeatureSelector, createSelector } from '@ngrx/store';
import { shiftReducer } from './shift.reducer';

export const shiftFeatureKey = 'shifts';

export const {
  selectShiftsState,
  selectShifts,
  selectSelectedShift,
  selectLoading: selectShiftLoading,
  selectSaving: selectShiftSaving,
  selectError: selectShiftError,
} = createFeature({
  name: shiftFeatureKey,
  reducer: shiftReducer,
});

export const selectShiftsByStatus = (status: string) =>
  createSelector(selectShifts, shifts => shifts.filter(s => s.status === status));

export const selectShiftsByGuard = (guardId: string) =>
  createSelector(selectShifts, shifts => shifts.filter(s => s.guardId === guardId));

export const selectShiftsBySite = (siteId: string) =>
  createSelector(selectShifts, shifts => shifts.filter(s => s.siteId === siteId));

export const selectActiveShifts = createSelector(
  selectShifts,
  shifts => shifts.filter(s => s.status === 'Active')
);

export const selectScheduledShifts = createSelector(
  selectShifts,
  shifts => shifts.filter(s => s.status === 'Scheduled')
);

export const selectCompletedShifts = createSelector(
  selectShifts,
  shifts => shifts.filter(s => s.status === 'Completed')
);
