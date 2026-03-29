import { createReducer, on } from '@ngrx/store';
import { UserMgmtActions } from './user-mgmt.actions';
import { UserDto, UserAccessDto } from '../models/user-mgmt.model';

export interface UserMgmtState {
  users: UserDto[];
  accessList: UserAccessDto[];
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialUserMgmtState: UserMgmtState = {
  users: [], accessList: [], totalRecords: 0,
  loading: false, saving: false, error: null,
};

export const userMgmtReducer = createReducer(
  initialUserMgmtState,

  on(UserMgmtActions.loadUsers, state => ({ ...state, loading: true, error: null })),
  on(UserMgmtActions.loadUsersSuccess, (state, { users, totalRecords }) => ({ ...state, loading: false, users, totalRecords })),
  on(UserMgmtActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UserMgmtActions.loadAccessList, state => ({ ...state, loading: true, error: null })),
  on(UserMgmtActions.loadAccessListSuccess, (state, { accessList }) => ({ ...state, loading: false, accessList })),
  on(UserMgmtActions.loadAccessListFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(UserMgmtActions.activateUser, state => ({ ...state, saving: true })),
  on(UserMgmtActions.activateUserSuccess, (state, { user }) => ({
    ...state, saving: false,
    users: state.users.map(u => u.id === user.id ? user : u),
    accessList: state.accessList.map(a => a.userId === user.id ? { ...a, isActive: true } : a),
  })),
  on(UserMgmtActions.activateUserFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(UserMgmtActions.deactivateUser, state => ({ ...state, saving: true })),
  on(UserMgmtActions.deactivateUserSuccess, (state, { id }) => ({
    ...state, saving: false,
    users: state.users.map(u => u.id === id ? { ...u, isActive: false } : u),
    accessList: state.accessList.map(a => a.userId === id ? { ...a, isActive: false } : a),
  })),
  on(UserMgmtActions.deactivateUserFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(UserMgmtActions.assignRole, state => ({ ...state, saving: true })),
  on(UserMgmtActions.assignRoleSuccess, state => ({ ...state, saving: false })),
  on(UserMgmtActions.assignRoleFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(UserMgmtActions.deleteUser, state => ({ ...state, saving: true })),
  on(UserMgmtActions.deleteUserSuccess, (state, { id }) => ({
    ...state, saving: false,
    users: state.users.filter(u => u.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(UserMgmtActions.deleteUserFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
