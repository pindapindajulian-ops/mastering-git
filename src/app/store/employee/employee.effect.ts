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
          map((res: Employee) => {
            console.log(' SAVED TO DB.JSON:', res);
            return EmployeeActions.loadEmployees();
          }),
          catchError((error: Error) => {
            console.error(' ADD EMPLOYEE ERROR:', error);
            return of(EmployeeActions.loadEmployeesFailure({
              error: error.message || 'Failed to add employee'
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
              error: error.message || 'Failed to delete employee'
            }));
          })
        )
      )
    )
  );
}
