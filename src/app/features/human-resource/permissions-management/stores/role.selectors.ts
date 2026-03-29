import { createFeature } from '@ngrx/store';
import { roleReducer } from './role.reducer';

export const roleFeatureKey = 'roles';

export const {
  selectRolesState,
  selectRoles,
  selectSelectedRole,
  selectTotalRecords: selectRoleTotalCount,
  selectLoading: selectRoleLoading,
  selectSaving: selectRoleSaving,
  selectError: selectRoleError,
} = createFeature({ name: roleFeatureKey, reducer: roleReducer });
