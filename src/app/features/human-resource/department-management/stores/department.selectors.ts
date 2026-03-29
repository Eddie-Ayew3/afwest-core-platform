import { createFeature, createSelector } from '@ngrx/store';
import { departmentReducer } from './department.reducer';

export const departmentFeatureKey = 'departments';

export const {
  selectDepartmentsState,
  selectDepartments,
  selectSelectedDepartment,
  selectLoading: selectDepartmentLoading,
  selectSaving: selectDepartmentSaving,
  selectError: selectDepartmentError,
} = createFeature({
  name: departmentFeatureKey,
  reducer: departmentReducer,
});

export const selectActiveDepartments = createSelector(
  selectDepartments,
  departments => departments.filter(d => d.isActive)
);

export const selectInactiveDepartments = createSelector(
  selectDepartments,
  departments => departments.filter(d => !d.isActive)
);
