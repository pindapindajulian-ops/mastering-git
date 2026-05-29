import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EmployeeActions from './employee.action';
import { EmployeeService } from '../../core/services/employee';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class EmployeeEffects {

  constructor(
    private actions$: Actions,
    private service: EmployeeService
  ) {}

  // LOAD EMPLOYEES
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.service.getEmployees().pipe(
          map((employees) =>
            EmployeeActions.loadEmployeesSuccess({ employees })
          ),
          catchError((error) =>
            of(EmployeeActions.loadEmployeesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ADD EMPLOYEE
  addEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.addEmployee),
      mergeMap((action) =>
        this.service.addEmployee(action.employee).pipe(
          map(() =>
            EmployeeActions.loadEmployees()
          )
        )
      )
    )
  );

  // DELETE EMPLOYEE
  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap((action) =>
        this.service.deleteEmployee(action.id).pipe(
          map(() =>
            EmployeeActions.loadEmployees()
          )
        )
      )
    )
  );

}
