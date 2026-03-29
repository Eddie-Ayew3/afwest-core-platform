import { createFeature, createSelector } from '@ngrx/store';
import { regionReducer } from './region.reducer';

export const regionFeatureKey = 'regions';

export const {
  selectRegionsState,
  selectRegions,
  selectSelectedRegion,
  selectLoading: selectRegionLoading,
  selectSaving: selectRegionSaving,
  selectError: selectRegionError,
} = createFeature({
  name: regionFeatureKey,
  reducer: regionReducer,
});

export const selectTotalCount = createSelector(
  selectRegionsState,
  state => state.totalRecords
);

export const selectActiveRegions = createSelector(
  selectRegions,
  regions => regions.filter(r => r.isActive)
);

export const selectInactiveRegions = createSelector(
  selectRegions,
  regions => regions.filter(r => !r.isActive)
);
