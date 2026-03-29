import { createReducer, on } from '@ngrx/store';
import { DepartmentActions } from './department.actions';
import { DepartmentDto } from '../models/department.model';

export interface DepartmentState {
  departments: DepartmentDto[];
  selectedDepartment: DepartmentDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialDepartmentState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  saving: false,
  error: null,
};

export const departmentReducer = createReducer(
  initialDepartmentState,

  // Load Departments
  on(DepartmentActions.loadDepartments, state => ({ ...state, loading: true, error: null })),
  on(DepartmentActions.loadDepartmentsSuccess, (state, { departments }) => ({ ...state, loading: false, departments })),
  on(DepartmentActions.loadDepartmentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Department
  on(DepartmentActions.createDepartment, state => ({ ...state, saving: true, error: null })),
  on(DepartmentActions.createDepartmentSuccess, (state, { department }) => ({ ...state, saving: false, departments: [...state.departments, department] })),
  on(DepartmentActions.createDepartmentFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Department
  on(DepartmentActions.updateDepartment, state => ({ ...state, saving: true, error: null })),
  on(DepartmentActions.updateDepartmentSuccess, (state, { department }) => ({
    ...state,
    saving: false,
    departments: state.departments.map(d => d.id === department.id ? department : d),
  })),
  on(DepartmentActions.updateDepartmentFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Department
  on(DepartmentActions.deleteDepartment, state => ({ ...state, saving: true, error: null })),
  on(DepartmentActions.deleteDepartmentSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    departments: state.departments.filter(d => d.id !== id),
  })),
  on(DepartmentActions.deleteDepartmentFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
