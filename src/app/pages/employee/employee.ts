import { Component, OnInit, PLATFORM_ID, signal, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as EmployeeActions from '../../store/employee/employee.action';
import * as EmployeeSelectors from '../../store/employee/employee.selector';
import { validateEmployee } from '../../core/validators/employee.validator';
import { Employee as EmployeeModel } from '../../store/employee/employee.model';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Signals
  isFormvisible = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editId = signal<number | string | null>(null);
  isAdmin = signal<boolean>(false);
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  pageSizeOptions = [5, 10, 20];

  // Observables
  employeeList$!: Observable<EmployeeModel[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string>;

  // Employee object for form
  employeeObj: EmployeeModel = {
    name: '',
    email: '',
    password: '',
    gender: '',
    contactNo: '',
    department: '',
    role: ''
  };

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // Select data from store
    this.employeeList$ = this.store.select(EmployeeSelectors.selectAllEmployees);
    this.loading$ = this.store.select(EmployeeSelectors.selectLoading);
    this.error$ = this.store.select(EmployeeSelectors.selectError);

    if (!this.isBrowser) {
      return;
    }

    this.isAdmin.set(localStorage.getItem('userRole') === 'admin');

    // Load employees from NgRx store
    this.store.dispatch(EmployeeActions.loadEmployees());

    // Debug: Check if data is loading
    this.employeeList$.subscribe(employees => {
      console.log('Employees loaded in component:', employees);
      this.keepPageInRange(employees.length);
    });

    this.error$.subscribe(error => {
      if (error) {
        console.error('Error from store:', error);
        alert('Error: ' + error);
      }
    });
  }

  toggleForm() {
    if (!this.canManageEmployees()) {
      return;
    }

    this.isFormvisible.set(!this.isFormvisible());
    if (!this.isFormvisible()) {
      this.resetForm();
      this.isEditing.set(false);
      this.editId.set(null);
    }
  }

  resetForm() {
    this.employeeObj = {
      name: '',
      email: '',
      password: '',
      gender: '',
      contactNo: '',
      department: '',
      role: ''
    };
  }

  saveEmployee() {
    if (!this.canManageEmployees()) {
      return;
    }

    console.log('Saving employee...', this.employeeObj);

    // Validation
    if (!this.validateForm()) {
      return;
    }

    if (this.isEditing()) {
      // Update existing employee
      const updatedEmployee = {
        ...this.employeeObj,
        id: this.editId()
      };
      console.log('Update employee:', updatedEmployee);
      // TODO: Implement update action
      alert('Update functionality coming soon!');

      this.isEditing.set(false);
      this.editId.set(null);
    } else {
      // Add new employee
      const newEmployee = { ...this.employeeObj };
      delete newEmployee.id;

      console.log('Dispatching addEmployee action with:', newEmployee);
      this.store.dispatch(EmployeeActions.addEmployee({
        employee: newEmployee
      }));

      // Optional: Show success message
      setTimeout(() => {
        alert('Employee added successfully!');
      }, 100);
    }

    // Reset form
    this.resetForm();
    this.isFormvisible.set(false);
  }

  validateForm(): boolean {
    const validation = validateEmployee(this.employeeObj, !this.isEditing());

    if (!validation.valid) {
      alert(validation.message);
      return false;
    }

    return true;
  }

  deleteEmployee(id: number | string | undefined) {
    if (!this.canManageEmployees()) {
      return;
    }

    // Check if id exists
    if (!id) {
      console.error('Cannot delete: ID is undefined');
      alert('Error: Employee ID not found');
      return;
    }

    console.log('Delete button clicked for employee ID:', id);

    // Confirm before deleting
    const confirmed = confirm(`Are you sure you want to delete employee with ID ${id}?`);

    if (confirmed) {
      console.log('Dispatching deleteEmployee action for ID:', id);
      this.store.dispatch(EmployeeActions.deleteEmployee({ id }));

      // Optional: Show success message
      setTimeout(() => {
        alert('Employee deleted successfully!');
      }, 100);
    } else {
      console.log('Delete cancelled by user');
    }
  }

  editEmployee(employee: EmployeeModel) {
    if (!this.canManageEmployees()) {
      return;
    }

    console.log('Editing employee:', employee);

    // Set form with employee data
    this.employeeObj = { ...employee };

    // Clear password for security (don't show existing password)
    this.employeeObj.password = '';

    // Set editing mode
    this.isEditing.set(true);
    this.editId.set(employee.id || null);

    // Show form
    this.isFormvisible.set(true);

    // Scroll to form smoothly
    setTimeout(() => {
      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  viewEmployeeDetails(employee: EmployeeModel) {
    if (!employee?.id) {
      return;
    }

    this.router.navigate(['/employee-detail'], {
      queryParams: { id: employee.id }
    });
  }

  goToEmployeeSearch() {
    this.router.navigate(['/employee-detail']);
  }

  // Track by function for better performance
  trackById(index: number, employee: EmployeeModel): number | string {
    return employee.id || index;
  }

  getPaginatedEmployees(employees: EmployeeModel[]): EmployeeModel[] {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return employees.slice(startIndex, startIndex + this.pageSize());
  }

  getTotalPages(totalEmployees: number): number {
    return Math.max(1, Math.ceil(totalEmployees / this.pageSize()));
  }

  getPageNumbers(totalEmployees: number): number[] {
    const totalPages = this.getTotalPages(totalEmployees);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getStartItem(totalEmployees: number): number {
    if (totalEmployees === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize() + 1;
  }

  getEndItem(totalEmployees: number): number {
    return Math.min(this.currentPage() * this.pageSize(), totalEmployees);
  }

  goToPage(page: number, totalEmployees: number) {
    const totalPages = this.getTotalPages(totalEmployees);
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    this.currentPage.set(nextPage);
  }

  previousPage(totalEmployees: number) {
    this.goToPage(this.currentPage() - 1, totalEmployees);
  }

  nextPage(totalEmployees: number) {
    this.goToPage(this.currentPage() + 1, totalEmployees);
  }

  changePageSize(size: number | string) {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }

  private keepPageInRange(totalEmployees: number) {
    const totalPages = this.getTotalPages(totalEmployees);

    if (this.currentPage() > totalPages) {
      this.currentPage.set(totalPages);
    }
  }

  private canManageEmployees(): boolean {
    if (this.isAdmin()) {
      return true;
    }

    alert('Only admin can manage employees.');
    return false;
  }
}
