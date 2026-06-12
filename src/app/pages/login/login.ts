import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginobj: any = {
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  onLogin() {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        const user = employees.find(
          (employee) =>
            employee.email?.toLowerCase() === this.loginobj.email?.toLowerCase() &&
            employee.password === this.loginobj.password
        );

        if (!user) {
          alert('Invalid email or password. Please register or try again.');
          return;
        }

        const authRole =
          user.email?.toLowerCase() === 'admin' && user.password === 'password'
            ? 'admin'
            : 'user';

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', authRole);
        localStorage.setItem('currentUser', JSON.stringify(user));

        console.log('Login successful:', user.email, authRole);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('LOGIN ERROR:', error);
        alert('Login failed. Start the API server with: npm run api');
      }
    });
  }
}
