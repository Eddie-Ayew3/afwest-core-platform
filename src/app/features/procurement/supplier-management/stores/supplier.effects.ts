import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SupplierActions } from './supplier.actions';
import { SupplierService } from '../services/supplier.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class SupplierEffects {
  private actions$ = inject(Actions);
  private supplierService = inject(SupplierService);
  private toast = inject(ToastService);

  loadSuppliers$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.loadSuppliers),
    mergeMap(({ params }) => this.supplierService.getAll(params).pipe(
      map(result => SupplierActions.loadSuppliersSuccess({ suppliers: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(SupplierActions.loadSuppliersFailure({ error: error.message })))
    ))
  ));

  loadSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.loadSupplier),
    mergeMap(({ id }) => this.supplierService.getById(id).pipe(
      map(supplier => SupplierActions.loadSupplierSuccess({ supplier })),
      catchError(error => of(SupplierActions.loadSupplierFailure({ error: error.message })))
    ))
  ));

  createSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.createSupplier),
    mergeMap(({ dto }) => this.supplierService.create(dto).pipe(
      map(supplier => {
        this.toast.show({ title: 'Success', description: 'Supplier created successfully.', variant: 'success' });
        return SupplierActions.createSupplierSuccess({ supplier });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to create supplier.', variant: 'destructive' });
        return of(SupplierActions.createSupplierFailure({ error: error.message }));
      })
    ))
  ));

  updateSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.updateSupplier),
    mergeMap(({ id, dto }) => this.supplierService.update(id, dto).pipe(
      map(supplier => {
        this.toast.show({ title: 'Success', description: 'Supplier updated successfully.', variant: 'success' });
        return SupplierActions.updateSupplierSuccess({ supplier });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update supplier.', variant: 'destructive' });
        return of(SupplierActions.updateSupplierFailure({ error: error.message }));
      })
    ))
  ));

  activateSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.activateSupplier),
    mergeMap(({ id }) => this.supplierService.activate(id).pipe(
      map(supplier => {
        this.toast.show({ title: 'Activated', description: 'Supplier has been activated.', variant: 'success' });
        return SupplierActions.activateSupplierSuccess({ supplier });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to activate supplier.', variant: 'destructive' });
        return of(SupplierActions.activateSupplierFailure({ error: error.message }));
      })
    ))
  ));

  deactivateSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.deactivateSupplier),
    mergeMap(({ id }) => this.supplierService.deactivate(id).pipe(
      map(supplier => {
        this.toast.show({ title: 'Deactivated', description: 'Supplier has been deactivated.', variant: 'default' });
        return SupplierActions.deactivateSupplierSuccess({ supplier });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to deactivate supplier.', variant: 'destructive' });
        return of(SupplierActions.deactivateSupplierFailure({ error: error.message }));
      })
    ))
  ));

  deleteSupplier$ = createEffect(() => this.actions$.pipe(
    ofType(SupplierActions.deleteSupplier),
    mergeMap(({ id }) => this.supplierService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Success', description: 'Supplier deleted successfully.', variant: 'success' });
        return SupplierActions.deleteSupplierSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete supplier.', variant: 'destructive' });
        return of(SupplierActions.deleteSupplierFailure({ error: error.message }));
      })
    ))
  ));
}
