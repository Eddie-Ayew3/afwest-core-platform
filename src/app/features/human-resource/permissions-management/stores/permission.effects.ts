import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PermissionActions } from './permission.actions';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class PermissionEffects {
  private actions$ = inject(Actions);
  private permissionService = inject(PermissionService);

  loadPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(PermissionActions.loadPermissions),
    mergeMap(() => this.permissionService.getAll().pipe(
      map(permissions => PermissionActions.loadPermissionsSuccess({ permissions })),
      catchError(error => of(PermissionActions.loadPermissionsFailure({ error: error.message })))
    ))
  ));

  loadCategories$ = createEffect(() => this.actions$.pipe(
    ofType(PermissionActions.loadPermissionCategories),
    mergeMap(() => this.permissionService.getByCategory().pipe(
      map(categories => PermissionActions.loadPermissionCategoriesSuccess({ categories })),
      catchError(error => of(PermissionActions.loadPermissionCategoriesFailure({ error: error.message })))
    ))
  ));
}
