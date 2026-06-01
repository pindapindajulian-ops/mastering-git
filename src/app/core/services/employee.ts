import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../store/employee/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/employees';

  getEmployees(): Observable<Employee[]> {
    console.log('Fetching employees from:', this.apiUrl);
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    console.log('Adding employee:', employee);
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  deleteEmployee(id: number | string): Observable<void> {
    console.log('Deleting employee with id:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    console.log('Updating employee:', employee);
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee);
  }
}
