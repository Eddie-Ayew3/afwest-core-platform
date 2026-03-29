import { createActionGroup, props } from '@ngrx/store';
import { UserDto, UserAccessDto, ActivateUserDto, AssignRoleDto, UserListParams } from '../models/user-mgmt.model';

export const UserMgmtActions = createActionGroup({
  source: 'UserMgmt',
  events: {
    'Load Users': props<{ params?: UserListParams }>(),
    'Load Users Success': props<{ users: UserDto[]; totalRecords: number }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Load Access List': props<Record<string, never>>(),
    'Load Access List Success': props<{ accessList: UserAccessDto[] }>(),
    'Load Access List Failure': props<{ error: string }>(),

    'Activate User': props<{ id: string; dto: ActivateUserDto }>(),
    'Activate User Success': props<{ user: UserDto }>(),
    'Activate User Failure': props<{ error: string }>(),

    'Deactivate User': props<{ id: string }>(),
    'Deactivate User Success': props<{ id: string }>(),
    'Deactivate User Failure': props<{ error: string }>(),

    'Assign Role': props<{ id: string; dto: AssignRoleDto }>(),
    'Assign Role Success': props<Record<string, never>>(),
    'Assign Role Failure': props<{ error: string }>(),

    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),
  }
});
