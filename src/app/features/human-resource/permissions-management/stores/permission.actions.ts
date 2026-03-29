import { createActionGroup, props } from '@ngrx/store';
import { PermissionDetailDto, PermissionCategoryDto } from '../models/permission.model';

export const PermissionActions = createActionGroup({
  source: 'Permission',
  events: {
    'Load Permissions': props<Record<string, never>>(),
    'Load Permissions Success': props<{ permissions: PermissionDetailDto[] }>(),
    'Load Permissions Failure': props<{ error: string }>(),

    'Load Permission Categories': props<Record<string, never>>(),
    'Load Permission Categories Success': props<{ categories: PermissionCategoryDto[] }>(),
    'Load Permission Categories Failure': props<{ error: string }>(),
  }
});
