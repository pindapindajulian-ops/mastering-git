import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginobj: any = {
    email: '',
    password: ''
  }

  constructor(private router: Router) {}

  onLogin() {
    // Username: admin | Password: password
    if (this.loginobj.email === "admin" && this.loginobj.password === "password") {
      console.log("Login successful!");
      // Redirect to dashboard after successful login
      this.router.navigate(['/dashboard']);
    } else {
      alert("Invalid email or password! Use: admin / password");
    }
  }
}
