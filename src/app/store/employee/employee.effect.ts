import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as EmployeeActions from './employee.action';
import { EmployeeService } from '../../core/services/employee';
import { Employee } from './employee.model';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private service = inject(EmployeeService);

  // LOAD EMPLOYEES
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.service.getEmployees().pipe(
          map((employees: Employee[]) =>
            EmployeeActions.loadEmployeesSuccess({ employees })
          ),
          catchError((error: Error) =>
            of(EmployeeActions.loadEmployeesFailure({ error: getEmployeeErrorMessage(error) }))
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
          map((res: Employee) => {
            console.log(' SAVED TO DB.JSON:', res);
            return EmployeeActions.loadEmployees();
          }),
          catchError((error: Error) => {
            console.error(' ADD EMPLOYEE ERROR:', error);
            return of(EmployeeActions.loadEmployeesFailure({
              error: getEmployeeErrorMessage(error)
            }));
          })
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
          map(() => {
            console.log('✅ DELETED FROM DB.JSON:', action.id);
            return EmployeeActions.loadEmployees();
          }),
          catchError((error: Error) => {
            console.error('❌ DELETE EMPLOYEE ERROR:', error);
            return of(EmployeeActions.loadEmployeesFailure({
              error: getEmployeeErrorMessage(error)
            }));
          })
        )
      )
    )
  );
}

function getEmployeeErrorMessage(error: Error): string {
  if (error.message?.includes('Http failure during parsing')) {
    return 'API returned a web page instead of employee data. Make sure you run "npm run api" and restart "npm start".';
  }

  if (error.message?.includes('Http failure response') && error.message.includes(': 0 ')) {
    return 'Cannot connect to the employee API. Run "npm run api" in another terminal.';
  }

  return error.message || 'Employee request failed';
}
