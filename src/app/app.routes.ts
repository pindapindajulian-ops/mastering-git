import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { Project } from './pages/project/project';
import { Projectemployee } from './pages/projectemployee/projectemployee';
import { Attendance } from './pages/attendance/attendance';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',   // ← Hii inahakikisha default ni login
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'employee',
        component: Employee,
      },
      {
        path: 'project',
        component: Project,
      },
      {
        path: 'projectemployee',
        component: Projectemployee,
      },
      {
        path: 'attendance',
        component: Attendance,
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
