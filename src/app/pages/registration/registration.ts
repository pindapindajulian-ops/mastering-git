import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';
import { validateEmployee, validatePdfFile } from '../../core/validators/employee.validator';
import { Employee } from '../../store/employee/employee.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  isSubmitting = false;
  selectedFileName = '';

  employeeObj: Employee = {
    name: '',
    email: '',
    password: '',
    gender: '',
    contactNo: '',
    department: '',
    role: '',
    certificateName: '',
    certificateType: '',
    certificateData: ''
  };

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  onCertificateSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.clearCertificate();
      return;
    }

    const validation = validatePdfFile(file);

    if (!validation.valid) {
      alert(validation.message);
      input.value = '';
      this.clearCertificate();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedFileName = file.name;
      this.employeeObj.certificateName = file.name;
      this.employeeObj.certificateType = file.type;
      this.employeeObj.certificateData = String(reader.result);
    };

    reader.readAsDataURL(file);
  }

  registerEmployee() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.employeeService.addEmployee(this.employeeObj).subscribe({
      next: () => {
        alert('Registration submitted successfully.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('REGISTRATION ERROR:', error);
        alert(this.getRegistrationErrorMessage(error));
        this.isSubmitting = false;
      }
    });
  }

  private validateForm(): boolean {
    const validation = validateEmployee(this.employeeObj, true, false);

    if (!validation.valid) {
      alert(validation.message);
      return false;
    }

    return true;
  }

  private clearCertificate() {
    this.selectedFileName = '';
    this.employeeObj.certificateName = '';
    this.employeeObj.certificateType = '';
    this.employeeObj.certificateData = '';
  }

  private getRegistrationErrorMessage(error: { status?: number }): string {
    if (error.status === 0) {
      return 'Registration failed. Start JSON server with: npm run api';
    }

    if (error.status === 413) {
      return 'Registration failed. PDF file is too large.';
    }

    return 'Registration failed. Please check the form and try again.';
  }
}
