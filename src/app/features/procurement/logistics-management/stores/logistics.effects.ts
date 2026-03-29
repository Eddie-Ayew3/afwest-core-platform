import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LogisticsActions } from './logistics.actions';
import { LogisticsService } from '../services/logistics.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class LogisticsEffects {
  private actions$ = inject(Actions);
  private logisticsService = inject(LogisticsService);
  private toast = inject(ToastService);

  loadShipments$ = createEffect(() => this.actions$.pipe(
    ofType(LogisticsActions.loadShipments),
    mergeMap(({ params }) => this.logisticsService.getAll(params).pipe(
      map(result => LogisticsActions.loadShipmentsSuccess({ shipments: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(LogisticsActions.loadShipmentsFailure({ error: error.message })))
    ))
  ));

  loadShipment$ = createEffect(() => this.actions$.pipe(
    ofType(LogisticsActions.loadShipment),
    mergeMap(({ id }) => this.logisticsService.getById(id).pipe(
      map(shipment => LogisticsActions.loadShipmentSuccess({ shipment })),
      catchError(error => of(LogisticsActions.loadShipmentFailure({ error: error.message })))
    ))
  ));

  createShipment$ = createEffect(() => this.actions$.pipe(
    ofType(LogisticsActions.createShipment),
    mergeMap(({ dto }) => this.logisticsService.create(dto).pipe(
      map(shipment => {
        this.toast.show({ title: 'Success', description: 'Shipment created successfully.', variant: 'success' });
        return LogisticsActions.createShipmentSuccess({ shipment });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to create shipment.', variant: 'destructive' });
        return of(LogisticsActions.createShipmentFailure({ error: error.message }));
      })
    ))
  ));

  updateShipmentStatus$ = createEffect(() => this.actions$.pipe(
    ofType(LogisticsActions.updateShipmentStatus),
    mergeMap(({ id, dto }) => this.logisticsService.updateStatus(id, dto).pipe(
      map(shipment => {
        this.toast.show({ title: 'Success', description: 'Shipment status updated.', variant: 'success' });
        return LogisticsActions.updateShipmentStatusSuccess({ shipment });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update shipment status.', variant: 'destructive' });
        return of(LogisticsActions.updateShipmentStatusFailure({ error: error.message }));
      })
    ))
  ));

  deleteShipment$ = createEffect(() => this.actions$.pipe(
    ofType(LogisticsActions.deleteShipment),
    mergeMap(({ id }) => this.logisticsService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Success', description: 'Shipment deleted successfully.', variant: 'success' });
        return LogisticsActions.deleteShipmentSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete shipment.', variant: 'destructive' });
        return of(LogisticsActions.deleteShipmentFailure({ error: error.message }));
      })
    ))
  ));
}
