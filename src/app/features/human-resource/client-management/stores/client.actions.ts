import { createActionGroup, props } from '@ngrx/store';
import { ClientDto, CreateClientDto, UpdateClientDto, ClientListParams, ClientStatusActionDto } from '../models/client.model';

export const ClientActions = createActionGroup({
  source: 'Client',
  events: {
    'Load Clients': props<{ params?: ClientListParams }>(),
    'Load Clients Success': props<{ clients: ClientDto[]; totalRecords: number }>(),
    'Load Clients Failure': props<{ error: string }>(),

    'Load Client': props<{ id: string }>(),
    'Load Client Success': props<{ client: ClientDto }>(),
    'Load Client Failure': props<{ error: string }>(),

    'Create Client': props<{ dto: CreateClientDto }>(),
    'Create Client Success': props<{ client: ClientDto }>(),
    'Create Client Failure': props<{ error: string }>(),

    'Update Client': props<{ id: string; dto: UpdateClientDto }>(),
    'Update Client Success': props<{ client: ClientDto }>(),
    'Update Client Failure': props<{ error: string }>(),

    'Approve Client': props<{ id: string; dto?: ClientStatusActionDto }>(),
    'Approve Client Success': props<{ client: ClientDto }>(),
    'Approve Client Failure': props<{ error: string }>(),

    'Suspend Client': props<{ id: string; dto?: ClientStatusActionDto }>(),
    'Suspend Client Success': props<{ client: ClientDto }>(),
    'Suspend Client Failure': props<{ error: string }>(),

    'Reinstate Client': props<{ id: string }>(),
    'Reinstate Client Success': props<{ client: ClientDto }>(),
    'Reinstate Client Failure': props<{ error: string }>(),

    'Terminate Client': props<{ id: string; dto?: ClientStatusActionDto }>(),
    'Terminate Client Success': props<{ client: ClientDto }>(),
    'Terminate Client Failure': props<{ error: string }>(),

    'Delete Client': props<{ id: string }>(),
    'Delete Client Success': props<{ id: string }>(),
    'Delete Client Failure': props<{ error: string }>(),
  }
});
