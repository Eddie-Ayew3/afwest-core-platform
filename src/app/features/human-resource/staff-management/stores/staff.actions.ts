import { createActionGroup, props } from '@ngrx/store';
import {
  StaffDto, CreateStaffDto, UpdateStaffDto, StaffListParams,
  ActivateUserDto, AssignRoleDto
} from '../models/staff.model';

export const StaffActions = createActionGroup({
  source: 'Staff',
  events: {
    'Load Staff': props<{ params?: StaffListParams }>(),
    'Load Staff Success': props<{ staff: StaffDto[]; totalRecords: number }>(),
    'Load Staff Failure': props<{ error: string }>(),

    'Load Staff Member': props<{ id: string }>(),
    'Load Staff Member Success': props<{ member: StaffDto }>(),
    'Load Staff Member Failure': props<{ error: string }>(),

    'Create Staff': props<{ dto: CreateStaffDto }>(),
    'Create Staff Success': props<{ member: StaffDto }>(),
    'Create Staff Failure': props<{ error: string }>(),

    'Update Staff': props<{ id: string; dto: UpdateStaffDto }>(),
    'Update Staff Success': props<{ member: StaffDto }>(),
    'Update Staff Failure': props<{ error: string }>(),

    'Deactivate Staff': props<{ id: string }>(),
    'Deactivate Staff Success': props<{ id: string }>(),
    'Deactivate Staff Failure': props<{ error: string }>(),

    'Delete Staff': props<{ id: string }>(),
    'Delete Staff Success': props<{ id: string }>(),
    'Delete Staff Failure': props<{ error: string }>(),

    'Activate Staff': props<{ id: string; dto: ActivateUserDto }>(),
    'Activate Staff Success': props<{ id: string }>(),
    'Activate Staff Failure': props<{ error: string }>(),

    'Assign Role': props<{ id: string; dto: AssignRoleDto }>(),
    'Assign Role Success': props<{ id: string }>(),
    'Assign Role Failure': props<{ error: string }>(),
  }
});
