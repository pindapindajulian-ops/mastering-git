import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from './employee.state';

export const selectEmployeeState =
  createFeatureSelector<EmployeeState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  (state) => state.employees
);

export const selectLoading = createSelector(
  selectEmployeeState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectEmployeeState,
  (state) => state.error
);
