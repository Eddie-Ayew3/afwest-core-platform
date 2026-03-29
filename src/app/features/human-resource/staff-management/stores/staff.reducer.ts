import { createReducer, on } from '@ngrx/store';
import { StaffActions } from './staff.actions';
import { StaffDto } from '../models/staff.model';

export interface StaffState {
  staff: StaffDto[];
  selectedMember: StaffDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialStaffState: StaffState = {
  staff: [], selectedMember: null, totalRecords: 0,
  loading: false, saving: false, error: null,
};

export const staffReducer = createReducer(
  initialStaffState,

  on(StaffActions.loadStaff, state => ({ ...state, loading: true, error: null })),
  on(StaffActions.loadStaffSuccess, (state, { staff, totalRecords }) => ({ ...state, loading: false, staff, totalRecords })),
  on(StaffActions.loadStaffFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(StaffActions.loadStaffMember, state => ({ ...state, loading: true })),
  on(StaffActions.loadStaffMemberSuccess, (state, { member }) => ({ ...state, loading: false, selectedMember: member })),
  on(StaffActions.loadStaffMemberFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(StaffActions.createStaff, state => ({ ...state, saving: true, error: null })),
  on(StaffActions.createStaffSuccess, (state, { member }) => ({ ...state, saving: false, staff: [...state.staff, member], totalRecords: state.totalRecords + 1 })),
  on(StaffActions.createStaffFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(StaffActions.updateStaff, state => ({ ...state, saving: true, error: null })),
  on(StaffActions.updateStaffSuccess, (state, { member }) => ({
    ...state, saving: false,
    staff: state.staff.map(s => s.id === member.id ? member : s),
  })),
  on(StaffActions.updateStaffFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(StaffActions.deactivateStaff, state => ({ ...state, saving: true })),
  on(StaffActions.deactivateStaffSuccess, (state, { id }) => ({
    ...state, saving: false,
    staff: state.staff.map(s => s.id === id ? { ...s, isActive: false } : s),
  })),
  on(StaffActions.deactivateStaffFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(StaffActions.deleteStaff, state => ({ ...state, saving: true })),
  on(StaffActions.deleteStaffSuccess, (state, { id }) => ({
    ...state, saving: false,
    staff: state.staff.filter(s => s.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(StaffActions.deleteStaffFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(StaffActions.activateStaff, state => ({ ...state, saving: true })),
  on(StaffActions.activateStaffSuccess, (state, { id }) => ({
    ...state, saving: false,
    staff: state.staff.map(s => s.id === id ? { ...s, isActive: true } : s),
  })),
  on(StaffActions.activateStaffFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(StaffActions.assignRole, state => ({ ...state, saving: true })),
  on(StaffActions.assignRoleSuccess, (state, { id }) => ({
    ...state, saving: false,
  })),
  on(StaffActions.assignRoleFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
