import { Component } from '@angular/core';
import {
  RouterOutlet,
  Router
} from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

  constructor(private router: Router) {}

  onLogout() {

    // Futa local storage
    localStorage.clear();

    // Rudisha login page
    this.router.navigate(['/login']);
  }
}
