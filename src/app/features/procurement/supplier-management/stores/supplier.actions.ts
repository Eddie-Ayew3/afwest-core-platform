import { createActionGroup, props } from '@ngrx/store';
import { SupplierDto, CreateSupplierDto, UpdateSupplierDto, SupplierListParams } from '../models/supplier.model';

export const SupplierActions = createActionGroup({
  source: 'Supplier',
  events: {
    'Load Suppliers': props<{ params?: SupplierListParams }>(),
    'Load Suppliers Success': props<{ suppliers: SupplierDto[]; totalRecords: number }>(),
    'Load Suppliers Failure': props<{ error: string }>(),

    'Load Supplier': props<{ id: string }>(),
    'Load Supplier Success': props<{ supplier: SupplierDto }>(),
    'Load Supplier Failure': props<{ error: string }>(),

    'Create Supplier': props<{ dto: CreateSupplierDto }>(),
    'Create Supplier Success': props<{ supplier: SupplierDto }>(),
    'Create Supplier Failure': props<{ error: string }>(),

    'Update Supplier': props<{ id: string; dto: UpdateSupplierDto }>(),
    'Update Supplier Success': props<{ supplier: SupplierDto }>(),
    'Update Supplier Failure': props<{ error: string }>(),

    'Activate Supplier': props<{ id: string }>(),
    'Activate Supplier Success': props<{ supplier: SupplierDto }>(),
    'Activate Supplier Failure': props<{ error: string }>(),

    'Deactivate Supplier': props<{ id: string }>(),
    'Deactivate Supplier Success': props<{ supplier: SupplierDto }>(),
    'Deactivate Supplier Failure': props<{ error: string }>(),

    'Delete Supplier': props<{ id: string }>(),
    'Delete Supplier Success': props<{ id: string }>(),
    'Delete Supplier Failure': props<{ error: string }>(),
  }
});
