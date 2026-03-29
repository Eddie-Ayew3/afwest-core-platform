import { createActionGroup, props } from '@ngrx/store';
import { RoleDto, CreateRoleDto, UpdateRoleDto, SetRolePermissionsDto } from '../models/role.model';

export const RoleActions = createActionGroup({
  source: 'Role',
  events: {
    'Load Roles': props<Record<string, never>>(),
    'Load Roles Success': props<{ roles: RoleDto[]; totalRecords: number }>(),
    'Load Roles Failure': props<{ error: string }>(),

    'Load Role': props<{ id: string }>(),
    'Load Role Success': props<{ role: RoleDto }>(),
    'Load Role Failure': props<{ error: string }>(),

    'Create Role': props<{ dto: CreateRoleDto }>(),
    'Create Role Success': props<{ role: RoleDto }>(),
    'Create Role Failure': props<{ error: string }>(),

    'Update Role': props<{ id: string; dto: UpdateRoleDto }>(),
    'Update Role Success': props<{ role: RoleDto }>(),
    'Update Role Failure': props<{ error: string }>(),

    'Delete Role': props<{ id: string }>(),
    'Delete Role Success': props<{ id: string }>(),
    'Delete Role Failure': props<{ error: string }>(),

    'Set Role Permissions': props<{ id: string; dto: SetRolePermissionsDto }>(),
    'Set Role Permissions Success': props<{ role: RoleDto }>(),
    'Set Role Permissions Failure': props<{ error: string }>(),
  }
});
