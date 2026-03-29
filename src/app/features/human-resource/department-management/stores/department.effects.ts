import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { DepartmentActions } from './department.actions';
import { DepartmentService } from '../services/department.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class DepartmentEffects {
  private readonly actions$ = inject(Actions);
  private readonly departmentService = inject(DepartmentService);
  private readonly toast = inject(ToastService);

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentActions.loadDepartments),
      mergeMap(({ params }) =>
        this.departmentService.getAll(params).pipe(
          map(departments => DepartmentActions.loadDepartmentsSuccess({ departments })),
          catchError(error => of(DepartmentActions.loadDepartmentsFailure({ error: error.message })))
        )
      )
    )
  );

  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentActions.createDepartment),
      mergeMap(({ dto }) =>
        this.departmentService.create(dto).pipe(
          map(department => {
            this.toast.show({ title: 'Success', description: 'Department created successfully.', variant: 'success' });
            return DepartmentActions.createDepartmentSuccess({ department });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to create department.', variant: 'destructive' });
            return of(DepartmentActions.createDepartmentFailure({ error: error.message }));
          })
        )
      )
    )
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentActions.updateDepartment),
      mergeMap(({ id, dto }) =>
        this.departmentService.update(id, dto).pipe(
          map(department => {
            this.toast.show({ title: 'Success', description: 'Department updated successfully.', variant: 'success' });
            return DepartmentActions.updateDepartmentSuccess({ department });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to update department.', variant: 'destructive' });
            return of(DepartmentActions.updateDepartmentFailure({ error: error.message }));
          })
        )
      )
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DepartmentActions.deleteDepartment),
      mergeMap(({ id }) =>
        this.departmentService.delete(id).pipe(
          map(() => {
            this.toast.show({ title: 'Success', description: 'Department deleted successfully.', variant: 'success' });
            return DepartmentActions.deleteDepartmentSuccess({ id });
          }),
          catchError(error => {
            this.toast.show({ title: 'Error', description: 'Failed to delete department.', variant: 'destructive' });
            return of(DepartmentActions.deleteDepartmentFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
