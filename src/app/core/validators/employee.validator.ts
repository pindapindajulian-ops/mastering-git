import { Employee } from '../../store/employee/employee.model';

export interface ValidationResult {
  valid: boolean;
  message: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[A-Za-z\s'.-]{2,}$/;
const phonePattern = /^\+?[0-9]{10,15}$/;
const maxPdfSizeInBytes = 2 * 1024 * 1024;

export function validateRequired(value: string | undefined, label: string): ValidationResult {
  if (!value?.trim()) {
    return invalid(`Please enter ${label}.`);
  }

  return valid();
}

export function validateName(name: string | undefined): ValidationResult {
  const required = validateRequired(name, 'employee name');

  if (!required.valid) {
    return required;
  }

  if (!namePattern.test(name!.trim())) {
    return invalid('Employee name must contain letters only and at least 2 characters.');
  }

  return valid();
}

export function validateEmail(email: string | undefined): ValidationResult {
  const required = validateRequired(email, 'email');

  if (!required.valid) {
    return required;
  }

  if (!emailPattern.test(email!.trim())) {
    return invalid('Please enter a valid email address.');
  }

  return valid();
}

export function validatePhoneNumber(contactNo: string | undefined): ValidationResult {
  const required = validateRequired(contactNo, 'contact number');

  if (!required.valid) {
    return required;
  }

  if (!phonePattern.test(contactNo!.trim())) {
    return invalid('Contact number must be 10 to 15 digits. Example: 0712345678.');
  }

  return valid();
}

export function validatePassword(password: string | undefined, required = true): ValidationResult {
  if (!required && !password?.trim()) {
    return valid();
  }

  const requiredResult = validateRequired(password, 'password');

  if (!requiredResult.valid) {
    return requiredResult;
  }

  if (password!.trim().length < 4) {
    return invalid('Password must be at least 4 characters.');
  }

  return valid();
}

export function validatePdfFile(file: File | undefined): ValidationResult {
  if (!file) {
    return invalid('Please upload your certificate PDF.');
  }

  if (file.type !== 'application/pdf') {
    return invalid('Please upload PDF certificate only.');
  }

  if (file.size > maxPdfSizeInBytes) {
    return invalid('PDF certificate must be 2MB or smaller.');
  }

  return valid();
}

export function validateEmployee(employee: Employee, requirePassword = true, requireCertificate = false): ValidationResult {
  const checks: ValidationResult[] = [
    validateName(employee.name),
    validateEmail(employee.email),
    validatePassword(employee.password, requirePassword),
    validateRequired(employee.gender, 'gender'),
    validatePhoneNumber(employee.contactNo),
    validateRequired(employee.department, 'department'),
    validateRequired(employee.role, 'role')
  ];

  if (requireCertificate && !employee.certificateData) {
    checks.push(invalid('Please upload your certificate PDF.'));
  }

  return checks.find((result) => !result.valid) || valid();
}

function valid(): ValidationResult {
  return {
    valid: true,
    message: ''
  };
}

function invalid(message: string): ValidationResult {
  return {
    valid: false,
    message
  };
}
