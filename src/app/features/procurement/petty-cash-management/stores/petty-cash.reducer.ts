import { createReducer, on } from '@ngrx/store';
import { PettyCashActions } from './petty-cash.actions';
import { PettyCashDto } from '../models/petty-cash.model';

export interface PettyCashState {
  transactions: PettyCashDto[];
  selectedTransaction: PettyCashDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialPettyCashState: PettyCashState = {
  transactions: [],
  selectedTransaction: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const pettyCashReducer = createReducer(
  initialPettyCashState,

  on(PettyCashActions.loadTransactions, state => ({ ...state, loading: true, error: null })),
  on(PettyCashActions.loadTransactionsSuccess, (state, { transactions, totalRecords }) => ({ ...state, loading: false, transactions, totalRecords })),
  on(PettyCashActions.loadTransactionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PettyCashActions.loadTransaction, state => ({ ...state, loading: true })),
  on(PettyCashActions.loadTransactionSuccess, (state, { transaction }) => ({ ...state, loading: false, selectedTransaction: transaction })),
  on(PettyCashActions.loadTransactionFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(PettyCashActions.createTransaction, state => ({ ...state, saving: true, error: null })),
  on(PettyCashActions.createTransactionSuccess, (state, { transaction }) => ({
    ...state, saving: false,
    transactions: [...state.transactions, transaction],
    totalRecords: state.totalRecords + 1,
  })),
  on(PettyCashActions.createTransactionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PettyCashActions.approveTransaction, state => ({ ...state, saving: true })),
  on(PettyCashActions.approveTransactionSuccess, (state, { transaction }) => ({
    ...state, saving: false,
    transactions: state.transactions.map(t => t.id === transaction.id ? transaction : t),
  })),
  on(PettyCashActions.approveTransactionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PettyCashActions.rejectTransaction, state => ({ ...state, saving: true })),
  on(PettyCashActions.rejectTransactionSuccess, (state, { transaction }) => ({
    ...state, saving: false,
    transactions: state.transactions.map(t => t.id === transaction.id ? transaction : t),
  })),
  on(PettyCashActions.rejectTransactionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(PettyCashActions.deleteTransaction, state => ({ ...state, saving: true })),
  on(PettyCashActions.deleteTransactionSuccess, (state, { id }) => ({
    ...state, saving: false,
    transactions: state.transactions.filter(t => t.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(PettyCashActions.deleteTransactionFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
