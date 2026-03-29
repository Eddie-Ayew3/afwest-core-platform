import { createReducer, on } from '@ngrx/store';
import { GuardActions } from './guard.actions';
import { GuardDto, GuardPerformanceDto, GuardAssignmentDto } from '../models/guard.model';

export interface GuardState {
  guards: GuardDto[];
  selectedGuard: GuardDto | null;
  performance: GuardPerformanceDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialGuardState: GuardState = {
  guards: [],
  selectedGuard: null,
  performance: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const guardReducer = createReducer(
  initialGuardState,

  on(GuardActions.loadGuards, state => ({ ...state, loading: true, error: null })),
  on(GuardActions.loadGuardsSuccess, (state, { guards, totalRecords }) => ({ ...state, loading: false, guards, totalRecords })),
  on(GuardActions.loadGuardsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GuardActions.loadGuard, state => ({ ...state, loading: true })),
  on(GuardActions.loadGuardSuccess, (state, { guard }) => ({ ...state, loading: false, selectedGuard: guard })),
  on(GuardActions.loadGuardFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GuardActions.createGuard, state => ({ ...state, saving: true, error: null })),
  on(GuardActions.createGuardSuccess, (state, { guard }) => ({ ...state, saving: false, guards: [...state.guards, guard], totalRecords: state.totalRecords + 1 })),
  on(GuardActions.createGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.updateGuard, state => ({ ...state, saving: true, error: null })),
  on(GuardActions.updateGuardSuccess, (state, { guard }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === guard.id ? guard : g),
    selectedGuard: state.selectedGuard?.id === guard.id ? guard : state.selectedGuard,
  })),
  on(GuardActions.updateGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.approveGuard, state => ({ ...state, saving: true })),
  on(GuardActions.approveGuardSuccess, (state, { guard }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === guard.id ? guard : g),
  })),
  on(GuardActions.approveGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.rejectGuard, state => ({ ...state, saving: true })),
  on(GuardActions.rejectGuardSuccess, (state, { guard }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === guard.id ? guard : g),
  })),
  on(GuardActions.rejectGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.deleteGuard, state => ({ ...state, saving: true })),
  on(GuardActions.deleteGuardSuccess, (state, { id }) => ({
    ...state, saving: false,
    guards: state.guards.filter(g => g.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(GuardActions.deleteGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.loadGuardPerformance, state => ({ ...state, loading: true })),
  on(GuardActions.loadGuardPerformanceSuccess, (state, { performance }) => ({ ...state, loading: false, performance })),
  on(GuardActions.loadGuardPerformanceFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(GuardActions.assignGuard, state => ({ ...state, saving: true })),
  on(GuardActions.assignGuardSuccess, (state, { assignment }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === assignment.guardId ? { ...g, siteId: assignment.siteId, siteName: assignment.siteName } : g),
  })),
  on(GuardActions.assignGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.transferGuard, state => ({ ...state, saving: true })),
  on(GuardActions.transferGuardSuccess, (state, { assignment }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === assignment.guardId ? { ...g, siteId: assignment.siteId, siteName: assignment.siteName } : g),
  })),
  on(GuardActions.transferGuardFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(GuardActions.endGuardAssignment, state => ({ ...state, saving: true })),
  on(GuardActions.endGuardAssignmentSuccess, (state, { id }) => ({
    ...state, saving: false,
    guards: state.guards.map(g => g.id === id ? { ...g, siteId: undefined, siteName: undefined } : g),
  })),
  on(GuardActions.endGuardAssignmentFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
