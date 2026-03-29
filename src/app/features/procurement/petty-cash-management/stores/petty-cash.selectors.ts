import { createFeature, createSelector } from '@ngrx/store';
import { pettyCashReducer } from './petty-cash.reducer';

export const pettyCashFeatureKey = 'pettyCash';

export const {
  selectPettyCashState,
  selectTransactions,
  selectSelectedTransaction,
  selectTotalRecords: selectPettyCashTotalCount,
  selectLoading: selectPettyCashLoading,
  selectSaving: selectPettyCashSaving,
  selectError: selectPettyCashError,
} = createFeature({ name: pettyCashFeatureKey, reducer: pettyCashReducer });

export const selectPendingTransactions = createSelector(selectTransactions, transactions => transactions.filter(t => t.status === 'Pending'));
export const selectApprovedTransactions = createSelector(selectTransactions, transactions => transactions.filter(t => t.status === 'Approved'));
