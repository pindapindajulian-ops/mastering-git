import { createReducer, on } from '@ngrx/store';

import * as EmployeeActions from './employee.action';

import { EmployeeState } from './employee.state';

import { initialState } from './employee.state';

export const employeeReducer = createReducer(

  initialState,

  on(EmployeeActions.loadEmployees, (state) => ({

    ...state,

    loading: true

  })),

  on(EmployeeActions.loadEmployeesSuccess, (state, action) => ({

    ...state,

    loading: false,

    employees: action.employees

  })),

  on(EmployeeActions.loadEmployeesFailure, (state, action) => ({

    ...state,

    loading: false,

    error: action.error

  }))

);
