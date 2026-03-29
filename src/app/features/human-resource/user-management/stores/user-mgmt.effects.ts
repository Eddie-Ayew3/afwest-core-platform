import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { UserMgmtActions } from './user-mgmt.actions';
import { UserMgmtService } from '../services/user-mgmt.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class UserMgmtEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserMgmtService);
  private toast = inject(ToastService);

  loadUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.loadUsers),
    mergeMap(({ params }) => this.userService.getAll(params).pipe(
      map(result => UserMgmtActions.loadUsersSuccess({ users: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(UserMgmtActions.loadUsersFailure({ error: error.message })))
    ))
  ));

  loadAccessList$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.loadAccessList),
    mergeMap(() => this.userService.getAccessList().pipe(
      map(accessList => UserMgmtActions.loadAccessListSuccess({ accessList })),
      catchError(error => of(UserMgmtActions.loadAccessListFailure({ error: error.message })))
    ))
  ));

  activateUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.activateUser),
    mergeMap(({ id, dto }) => this.userService.activate(id, dto).pipe(
      map(user => {
        this.toast.show({ title: 'Activated', description: 'User access activated.', variant: 'success' });
        return UserMgmtActions.activateUserSuccess({ user });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to activate user.', variant: 'destructive' });
        return of(UserMgmtActions.activateUserFailure({ error: error.message }));
      })
    ))
  ));

  deactivateUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.deactivateUser),
    mergeMap(({ id }) => this.userService.deactivate(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deactivated', description: 'User access revoked.', variant: 'destructive' });
        return UserMgmtActions.deactivateUserSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to deactivate user.', variant: 'destructive' });
        return of(UserMgmtActions.deactivateUserFailure({ error: error.message }));
      })
    ))
  ));

  assignRole$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.assignRole),
    mergeMap(({ id, dto }) => this.userService.assignRole(id, dto).pipe(
      map(() => {
        this.toast.show({ title: 'Role Assigned', description: 'Role assigned successfully.', variant: 'success' });
        return UserMgmtActions.assignRoleSuccess({});
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to assign role.', variant: 'destructive' });
        return of(UserMgmtActions.assignRoleFailure({ error: error.message }));
      })
    ))
  ));

  assignRoleSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.assignRoleSuccess),
    map(() => UserMgmtActions.loadUsers({}))
  ));

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserMgmtActions.deleteUser),
    mergeMap(({ id }) => this.userService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deleted', description: 'User deleted.', variant: 'success' });
        return UserMgmtActions.deleteUserSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' });
        return of(UserMgmtActions.deleteUserFailure({ error: error.message }));
      })
    ))
  ));
}
