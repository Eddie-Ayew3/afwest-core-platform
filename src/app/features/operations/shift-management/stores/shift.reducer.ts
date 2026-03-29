import { createReducer, on } from '@ngrx/store';
import { ShiftActions } from './shift.actions';
import { ShiftDto, ShiftStatus } from '../models/shift.model';

export interface ShiftState {
  shifts: ShiftDto[];
  selectedShift: ShiftDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialShiftState: ShiftState = {
  shifts: [],
  selectedShift: null,
  loading: false,
  saving: false,
  error: null,
};

export const shiftReducer = createReducer(
  initialShiftState,

  // Load Shifts
  on(ShiftActions.loadShifts, state => ({ ...state, loading: true, error: null })),
  on(ShiftActions.loadShiftsSuccess, (state, { shifts }) => ({ ...state, loading: false, shifts })),
  on(ShiftActions.loadShiftsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Shift
  on(ShiftActions.createShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.createShiftSuccess, (state, { shift }) => ({ ...state, saving: false, shifts: [...state.shifts, shift] })),
  on(ShiftActions.createShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Shift
  on(ShiftActions.updateShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.updateShiftSuccess, (state, { shift }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === shift.id ? shift : s),
  })),
  on(ShiftActions.updateShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Shift
  on(ShiftActions.deleteShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.deleteShiftSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.filter(s => s.id !== id),
  })),
  on(ShiftActions.deleteShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Start Shift
  on(ShiftActions.startShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.startShiftSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Active' as ShiftStatus, statusName: 'Active' } : s),
  })),
  on(ShiftActions.startShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Complete Shift
  on(ShiftActions.completeShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.completeShiftSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Completed' as ShiftStatus, statusName: 'Completed' } : s),
  })),
  on(ShiftActions.completeShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Cancel Shift
  on(ShiftActions.cancelShift, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.cancelShiftSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Cancelled' as ShiftStatus, statusName: 'Cancelled' } : s),
  })),
  on(ShiftActions.cancelShiftFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Mark Missed
  on(ShiftActions.markMissed, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.markMissedSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Missed' as ShiftStatus, statusName: 'Missed' } : s),
  })),
  on(ShiftActions.markMissedFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Manual Check In/Out
  on(ShiftActions.manualCheckIn, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.manualCheckInSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Active' as ShiftStatus, statusName: 'Active' } : s),
  })),
  on(ShiftActions.manualCheckInFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ShiftActions.manualCheckOut, state => ({ ...state, saving: true, error: null })),
  on(ShiftActions.manualCheckOutSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    shifts: state.shifts.map(s => s.id === id ? { ...s, status: 'Completed' as ShiftStatus, statusName: 'Completed' } : s),
  })),
  on(ShiftActions.manualCheckOutFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
