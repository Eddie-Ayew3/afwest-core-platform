import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../services/client.service';
import { ToastService } from '@tolle_/tolle-ui';

@Injectable()
export class ClientEffects {
  private actions$ = inject(Actions);
  private clientService = inject(ClientService);
  private toast = inject(ToastService);

  loadClients$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.loadClients),
    mergeMap(({ params }) => this.clientService.getAll(params).pipe(
      map(result => ClientActions.loadClientsSuccess({ clients: result.data, totalRecords: result.totalRecords })),
      catchError(error => of(ClientActions.loadClientsFailure({ error: error.message })))
    ))
  ));

  loadClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.loadClient),
    mergeMap(({ id }) => this.clientService.getById(id).pipe(
      map(client => ClientActions.loadClientSuccess({ client })),
      catchError(error => of(ClientActions.loadClientFailure({ error: error.message })))
    ))
  ));

  createClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.createClient),
    mergeMap(({ dto }) => this.clientService.create(dto).pipe(
      map(client => {
        this.toast.show({ title: 'Success', description: 'Client registered successfully.', variant: 'success' });
        return ClientActions.createClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: error.error?.message ?? 'Failed to create client.', variant: 'destructive' });
        return of(ClientActions.createClientFailure({ error: error.message }));
      })
    ))
  ));

  updateClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.updateClient),
    mergeMap(({ id, dto }) => this.clientService.update(id, dto).pipe(
      map(client => {
        this.toast.show({ title: 'Success', description: 'Client updated.', variant: 'success' });
        return ClientActions.updateClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to update client.', variant: 'destructive' });
        return of(ClientActions.updateClientFailure({ error: error.message }));
      })
    ))
  ));

  approveClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.approveClient),
    mergeMap(({ id, dto }) => this.clientService.approve(id, dto).pipe(
      map(client => {
        this.toast.show({ title: 'Approved', description: 'Client approved.', variant: 'success' });
        return ClientActions.approveClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to approve client.', variant: 'destructive' });
        return of(ClientActions.approveClientFailure({ error: error.message }));
      })
    ))
  ));

  suspendClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.suspendClient),
    mergeMap(({ id, dto }) => this.clientService.suspend(id, dto).pipe(
      map(client => {
        this.toast.show({ title: 'Suspended', description: 'Client suspended.', variant: 'destructive' });
        return ClientActions.suspendClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to suspend client.', variant: 'destructive' });
        return of(ClientActions.suspendClientFailure({ error: error.message }));
      })
    ))
  ));

  reinstateClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.reinstateClient),
    mergeMap(({ id }) => this.clientService.reinstate(id).pipe(
      map(client => {
        this.toast.show({ title: 'Reinstated', description: 'Client reinstated.', variant: 'success' });
        return ClientActions.reinstateClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to reinstate client.', variant: 'destructive' });
        return of(ClientActions.reinstateClientFailure({ error: error.message }));
      })
    ))
  ));

  terminateClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.terminateClient),
    mergeMap(({ id, dto }) => this.clientService.terminate(id, dto).pipe(
      map(client => {
        this.toast.show({ title: 'Terminated', description: 'Client contract terminated.', variant: 'destructive' });
        return ClientActions.terminateClientSuccess({ client });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to terminate client.', variant: 'destructive' });
        return of(ClientActions.terminateClientFailure({ error: error.message }));
      })
    ))
  ));

  deleteClient$ = createEffect(() => this.actions$.pipe(
    ofType(ClientActions.deleteClient),
    mergeMap(({ id }) => this.clientService.delete(id).pipe(
      map(() => {
        this.toast.show({ title: 'Deleted', description: 'Client deleted.', variant: 'success' });
        return ClientActions.deleteClientSuccess({ id });
      }),
      catchError(error => {
        this.toast.show({ title: 'Error', description: 'Failed to delete client.', variant: 'destructive' });
        return of(ClientActions.deleteClientFailure({ error: error.message }));
      })
    ))
  ));
}
