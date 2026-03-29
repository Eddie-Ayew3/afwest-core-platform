import { createActionGroup, props } from '@ngrx/store';
import { DepartmentDto, CreateDepartmentDto, UpdateDepartmentDto } from '../models/department.model';

export const DepartmentActions = createActionGroup({
  source: 'Department',
  events: {
    'Load Departments': props<{ params?: { isActive?: boolean } }>(),
    'Load Departments Success': props<{ departments: DepartmentDto[] }>(),
    'Load Departments Failure': props<{ error: string }>(),

    'Create Department': props<{ dto: CreateDepartmentDto }>(),
    'Create Department Success': props<{ department: DepartmentDto }>(),
    'Create Department Failure': props<{ error: string }>(),

    'Update Department': props<{ id: string; dto: UpdateDepartmentDto }>(),
    'Update Department Success': props<{ department: DepartmentDto }>(),
    'Update Department Failure': props<{ error: string }>(),

    'Delete Department': props<{ id: string }>(),
    'Delete Department Success': props<{ id: string }>(),
    'Delete Department Failure': props<{ error: string }>(),
  }
});
