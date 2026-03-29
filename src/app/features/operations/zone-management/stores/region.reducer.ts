import { createReducer, on } from '@ngrx/store';
import { RegionActions } from './region.actions';
import { RegionDto } from '../models/region.model';

export interface RegionState {
  regions: RegionDto[];
  totalRecords: number;
  selectedRegion: RegionDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialRegionState: RegionState = {
  regions: [],
  totalRecords: 0,
  selectedRegion: null,
  loading: false,
  saving: false,
  error: null,
};

export const regionReducer = createReducer(
  initialRegionState,

  // Load Regions
  on(RegionActions.loadRegions, state => ({ ...state, loading: true, error: null })),
  on(RegionActions.loadRegionsSuccess, (state, { regions, totalRecords }) => ({ 
    ...state, 
    loading: false, 
    regions,
    totalRecords 
  })),
  on(RegionActions.loadRegionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Region
  on(RegionActions.createRegion, state => ({ ...state, saving: true, error: null })),
  on(RegionActions.createRegionSuccess, (state, { region }) => ({ 
    ...state, 
    saving: false, 
    regions: [...state.regions, region],
    totalRecords: state.totalRecords + 1
  })),
  on(RegionActions.createRegionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Region
  on(RegionActions.updateRegion, state => ({ ...state, saving: true, error: null })),
  on(RegionActions.updateRegionSuccess, (state, { region }) => ({
    ...state,
    saving: false,
    regions: state.regions.map(r => r.id === region.id ? region : r),
  })),
  on(RegionActions.updateRegionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Region
  on(RegionActions.deleteRegion, state => ({ ...state, saving: true, error: null })),
  on(RegionActions.deleteRegionSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    regions: state.regions.filter(r => r.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(RegionActions.deleteRegionFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
