import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as EmployeeActions from '../../store/employee/employee.action';
import * as EmployeeSelectors from '../../store/employee/employee.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {

  isFormvisible = signal<boolean>(false);

   employeeList$!: Observable<any>;

  employeeObj: any = {
    name: '',
    email: '',
    password: '',
    gender: '',
    contactNo: '',
    department: '',
    role: ''
  };

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  ngOnInit(): void {

    // LOAD FROM NGRX STORE
    this.store.dispatch(EmployeeActions.loadEmployees());

    this.employeeList$ = this.store.select(
      EmployeeSelectors.selectAllEmployees
    );
  }

  toggleForm() {
    this.isFormvisible.set(!this.isFormvisible());
  }

  saveEmployee() {

    // NG NGRX FLOW (NOT HTTP)
    this.store.dispatch(
      EmployeeActions.addEmployee({
        employee: this.employeeObj
      })
    );

    this.employeeObj = {
      name: '',
      email: '',
      password: '',
      gender: '',
      contactNo: '',
      department: '',
      role: ''
    };

    this.isFormvisible.set(false);
  }

  deleteEmployee(id: number) {

    this.store.dispatch(
      EmployeeActions.deleteEmployee({ id })
    );

  }
}
