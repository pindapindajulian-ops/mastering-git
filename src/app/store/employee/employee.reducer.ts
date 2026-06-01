import { createReducer, on } from '@ngrx/store';

import * as EmployeeActions from './employee.action';

import { EmployeeState } from './employee.state';

import { initialState } from './employee.state';

export const employeeReducer = createReducer(

  initialState,

  on(EmployeeActions.loadEmployees, (state) => ({

    ...state,

    loading: true,

    error: ''

  })),

  on(EmployeeActions.loadEmployeesSuccess, (state, action) => ({

    ...state,

    loading: false,

    employees: action.employees,

    error: ''

  })),

  on(EmployeeActions.addEmployee, (state) => ({

    ...state,

    loading: true,

    error: ''

  })),

  on(EmployeeActions.deleteEmployee, (state) => ({
  ...state,
  loading: true,
  error: ''
  })),
  on(EmployeeActions.loadEmployeesFailure, (state, action) => ({

    ...state,

    loading: false,

    error: action.error

  }))

);
