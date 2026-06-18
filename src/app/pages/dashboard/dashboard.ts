import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userRole: string = '';
  userName: string = '';
  currentUser: any = null;

  dashboardFeatures = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View dashboard overview',
      icon: '📊',
      route: '/dashboard',
      adminOnly: false
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Manage projects',
      icon: '📁',
      route: '/project',
      adminOnly: false
    },
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Track attendance',
      icon: '✓',
      route: '/attendance',
      adminOnly: false
    },
    {
      id: 'employees',
      title: 'Employees',
      description: 'Manage employees',
      icon: '👥',
      route: '/employee',
      adminOnly: false
    },
    {
      id: 'users-management',
      title: 'Users Management',
      description: 'Roles | Permissions | users',
      icon: '👤',
      route: '/employee',
      adminOnly: true
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'System configurations | Workflow Process',
      icon: '⚙️',
      route: '/settings',
      adminOnly: true
    },
    {
      id: 'apply-leave',
      title: 'Apply for Leave',
      description: 'Submit leave requests',
      icon: '📋',
      route: '/apply-leave',
      adminOnly: false
    },
    {
      id: 'workstation',
      title: 'Workstation',
      description: 'Workstation',
      icon: '💻',
      route: '/workstation',
      adminOnly: false
    },
    {
      id: 'notification',
      title: 'Notification',
      description: 'Mail Config | SMS config',
      icon: '🔔',
      route: '/notification',
      adminOnly: true
    },
    {
      id: 'complaint-dispute',
      title: 'Complaint & Dispute',
      description: 'Complaints | Disputes',
      icon: '⚖️',
      route: '/complaint-dispute',
      adminOnly: false
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'All Reports',
      icon: '📊',
      route: '/reports',
      adminOnly: false
    }
  ];

  visibleFeatures: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserInfo();
    this.filterFeatures();
  }

  loadUserInfo() {
    const role = localStorage.getItem('userRole') || 'user';
    const user = localStorage.getItem('currentUser');

    this.userRole = role;
    if (user) {
      this.currentUser = JSON.parse(user);
      this.userName = this.currentUser.name || this.currentUser.email || 'User';
    }
  }

  filterFeatures() {
    this.visibleFeatures = this.dashboardFeatures;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
