import { createReducer, on } from '@ngrx/store';
import { PermissionActions } from './permission.actions';
import { PermissionDetailDto, PermissionCategoryDto } from '../models/permission.model';

export interface PermissionState {
  permissions: PermissionDetailDto[];
  categories: PermissionCategoryDto[];
  loading: boolean;
  error: string | null;
}

export const initialPermissionState: PermissionState = {
  permissions: [], categories: [],
  loading: false, error: null,
};

export const permissionReducer = createReducer(
  initialPermissionState,

  on(PermissionActions.loadPermissions, state => ({ ...state, loading: true, error: null })),
  on(PermissionActions.loadPermissionsSuccess, (state, { permissions }) => ({ ...state, loading: false, permissions })),
  on(PermissionActions.loadPermissionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PermissionActions.loadPermissionCategories, state => ({ ...state, loading: true, error: null })),
  on(PermissionActions.loadPermissionCategoriesSuccess, (state, { categories }) => ({ ...state, loading: false, categories })),
  on(PermissionActions.loadPermissionCategoriesFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
