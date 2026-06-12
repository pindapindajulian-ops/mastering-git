import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Employee } from '../../store/employee/employee.model';
import * as EmployeeActions from '../../store/employee/employee.action';
import * as EmployeeSelectors from '../../store/employee/employee.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css'],
})
export class EmployeeDetail implements OnInit {
  employeeList$!: Observable<Employee[]>;
  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  hasSearched = false;
  searchName = '';
  searchEmail = '';
  filterDepartment = '';
  filterRole = '';
  selectedEmployee: Employee | null = null;
  departmentOptions = ['IT', 'HR', 'Finance'];
  roleOptions: string[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeList$ = this.store.select(EmployeeSelectors.selectAllEmployees);
    this.store.dispatch(EmployeeActions.loadEmployees());

    this.employeeList$.subscribe((employees) => {
      this.allEmployees = employees;
      this.filteredEmployees = [];
      this.roleOptions = Array.from(
        new Set(employees.map((employee) => employee.role).filter(Boolean))
      );

      const id = this.route.snapshot.queryParamMap.get('id');
      if (id) {
        const employee = employees.find((emp) => String(emp.id) === id);
        if (employee) {
          this.selectedEmployee = employee;
        }
      }
    });
  }

  searchEmployees() {
    const nameTerm = this.normalizeSearchTerm(this.searchName);
    const emailTerm = this.normalizeSearchTerm(this.searchEmail);
    const departmentTerm = this.normalizeSearchTerm(this.filterDepartment);
    const roleTerm = this.normalizeSearchTerm(this.filterRole);

    this.filteredEmployees = this.allEmployees.filter((employee) => {
      const employeeName = this.normalizeSearchTerm(employee.name);
      const employeeEmail = this.normalizeSearchTerm(employee.email);
      const employeeDepartment = this.normalizeSearchTerm(employee.department);
      const employeeRole = this.normalizeSearchTerm(employee.role);

      const matchesName = !nameTerm || employeeName.includes(nameTerm);
      const matchesEmail = !emailTerm || employeeEmail.includes(emailTerm);
      const matchesDepartment =
        !departmentTerm || employeeDepartment.includes(departmentTerm);
      const matchesRole = !roleTerm || employeeRole.includes(roleTerm);

      return matchesName && matchesEmail && matchesDepartment && matchesRole;
    });
    this.hasSearched = true;

    if (!this.filteredEmployees.includes(this.selectedEmployee as Employee)) {
      this.selectedEmployee = null;
    }
  }

  private normalizeSearchTerm(value: string): string {
    return value?.trim().toLowerCase().replace(/\s+/g, ' ') || '';
  }

  selectEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }

  clearFilters() {
    this.searchName = '';
    this.searchEmail = '';
    this.filterDepartment = '';
    this.filterRole = '';
    this.filteredEmployees = [];
    this.hasSearched = false;
  }

  goBack() {
    this.router.navigate(['/employee']);
  }
}
