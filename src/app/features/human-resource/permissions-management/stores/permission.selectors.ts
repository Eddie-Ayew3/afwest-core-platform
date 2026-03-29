import { createFeature } from '@ngrx/store';
import { permissionReducer } from './permission.reducer';

export const permissionFeatureKey = 'permissions';

export const {
  selectPermissionsState,
  selectPermissions,
  selectCategories,
  selectLoading: selectPermissionLoading,
  selectError: selectPermissionError,
} = createFeature({ name: permissionFeatureKey, reducer: permissionReducer });
