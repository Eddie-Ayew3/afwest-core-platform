import { createReducer, on } from '@ngrx/store';
import { ClientActions } from './client.actions';
import { ClientDto } from '../models/client.model';

export interface ClientState {
  clients: ClientDto[];
  selectedClient: ClientDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialClientState: ClientState = {
  clients: [], selectedClient: null, totalRecords: 0,
  loading: false, saving: false, error: null,
};

const updateClient = (clients: ClientDto[], client: ClientDto) => clients.map(c => c.id === client.id ? client : c);

export const clientReducer = createReducer(
  initialClientState,

  on(ClientActions.loadClients, state => ({ ...state, loading: true, error: null })),
  on(ClientActions.loadClientsSuccess, (state, { clients, totalRecords }) => ({ ...state, loading: false, clients, totalRecords })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ClientActions.loadClient, state => ({ ...state, loading: true })),
  on(ClientActions.loadClientSuccess, (state, { client }) => ({ ...state, loading: false, selectedClient: client })),
  on(ClientActions.loadClientFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ClientActions.createClient, state => ({ ...state, saving: true, error: null })),
  on(ClientActions.createClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: [...state.clients, client], totalRecords: state.totalRecords + 1 })),
  on(ClientActions.createClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.updateClient, state => ({ ...state, saving: true, error: null })),
  on(ClientActions.updateClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: updateClient(state.clients, client) })),
  on(ClientActions.updateClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.approveClient, state => ({ ...state, saving: true })),
  on(ClientActions.approveClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: updateClient(state.clients, client) })),
  on(ClientActions.approveClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.suspendClient, state => ({ ...state, saving: true })),
  on(ClientActions.suspendClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: updateClient(state.clients, client) })),
  on(ClientActions.suspendClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.reinstateClient, state => ({ ...state, saving: true })),
  on(ClientActions.reinstateClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: updateClient(state.clients, client) })),
  on(ClientActions.reinstateClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.terminateClient, state => ({ ...state, saving: true })),
  on(ClientActions.terminateClientSuccess, (state, { client }) => ({ ...state, saving: false, clients: updateClient(state.clients, client) })),
  on(ClientActions.terminateClientFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(ClientActions.deleteClient, state => ({ ...state, saving: true })),
  on(ClientActions.deleteClientSuccess, (state, { id }) => ({ ...state, saving: false, clients: state.clients.filter(c => c.id !== id), totalRecords: state.totalRecords - 1 })),
  on(ClientActions.deleteClientFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
