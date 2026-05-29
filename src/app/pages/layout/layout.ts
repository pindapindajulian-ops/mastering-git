import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
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
