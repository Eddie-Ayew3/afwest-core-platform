import { createReducer, on } from '@ngrx/store';
import { RoleActions } from './role.actions';
import { RoleDto } from '../models/role.model';

export interface RoleState {
  roles: RoleDto[];
  selectedRole: RoleDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialRoleState: RoleState = {
  roles: [],
  selectedRole: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const roleReducer = createReducer(
  initialRoleState,

  on(RoleActions.loadRoles, state => ({ ...state, loading: true, error: null })),
  on(RoleActions.loadRolesSuccess, (state, { roles, totalRecords }) => ({ ...state, loading: false, roles, totalRecords })),
  on(RoleActions.loadRolesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(RoleActions.loadRole, state => ({ ...state, loading: true, error: null })),
  on(RoleActions.loadRoleSuccess, (state, { role }) => ({ ...state, loading: false, selectedRole: role })),
  on(RoleActions.loadRoleFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(RoleActions.createRole, state => ({ ...state, saving: true, error: null })),
  on(RoleActions.createRoleSuccess, (state, { role }) => ({
    ...state, saving: false,
    roles: [role, ...state.roles],
    totalRecords: state.totalRecords + 1,
  })),
  on(RoleActions.createRoleFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(RoleActions.updateRole, state => ({ ...state, saving: true, error: null })),
  on(RoleActions.updateRoleSuccess, (state, { role }) => ({
    ...state, saving: false,
    roles: state.roles.map(r => r.id === role.id ? role : r),
    selectedRole: state.selectedRole?.id === role.id ? role : state.selectedRole,
  })),
  on(RoleActions.updateRoleFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(RoleActions.deleteRole, state => ({ ...state, saving: true, error: null })),
  on(RoleActions.deleteRoleSuccess, (state, { id }) => ({
    ...state, saving: false,
    roles: state.roles.filter(r => r.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(RoleActions.deleteRoleFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(RoleActions.setRolePermissions, state => ({ ...state, saving: true, error: null })),
  on(RoleActions.setRolePermissionsSuccess, (state, { role }) => ({
    ...state, saving: false,
    roles: state.roles.map(r => r.id === role.id ? role : r),
    selectedRole: state.selectedRole?.id === role.id ? role : state.selectedRole,
  })),
  on(RoleActions.setRolePermissionsFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
