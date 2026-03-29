import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RoleActions } from './role.actions';
import { RoleService } from '../services/role.service';

@Injectable()
export class RoleEffects {
  private actions$ = inject(Actions);
  private roleService = inject(RoleService);

  loadRoles$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.loadRoles),
    mergeMap(() => this.roleService.getAll({ pageNumber: 1, pageSize: 100 }).pipe(
      map(result => RoleActions.loadRolesSuccess({ roles: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(RoleActions.loadRolesFailure({ error: error.message })))
    ))
  ));

  loadRole$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.loadRole),
    mergeMap(({ id }) => this.roleService.getById(id).pipe(
      map(role => RoleActions.loadRoleSuccess({ role })),
      catchError(error => of(RoleActions.loadRoleFailure({ error: error.message })))
    ))
  ));

  createRole$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.createRole),
    mergeMap(({ dto }) => this.roleService.create(dto).pipe(
      map(role => RoleActions.createRoleSuccess({ role })),
      catchError(error => of(RoleActions.createRoleFailure({ error: error.message })))
    ))
  ));

  updateRole$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.updateRole),
    mergeMap(({ id, dto }) => this.roleService.update(id, dto).pipe(
      map(role => RoleActions.updateRoleSuccess({ role })),
      catchError(error => of(RoleActions.updateRoleFailure({ error: error.message })))
    ))
  ));

  deleteRole$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.deleteRole),
    mergeMap(({ id }) => this.roleService.delete(id).pipe(
      map(() => RoleActions.deleteRoleSuccess({ id })),
      catchError(error => of(RoleActions.deleteRoleFailure({ error: error.message })))
    ))
  ));

  setRolePermissions$ = createEffect(() => this.actions$.pipe(
    ofType(RoleActions.setRolePermissions),
    mergeMap(({ id, dto }) => this.roleService.setPermissions(id, dto).pipe(
      map(role => RoleActions.setRolePermissionsSuccess({ role })),
      catchError(error => of(RoleActions.setRolePermissionsFailure({ error: error.message })))
    ))
  ));
}
