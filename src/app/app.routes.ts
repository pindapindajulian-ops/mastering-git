import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Employee } from './pages/employee/employee';
import { Project } from './pages/project/project';
import { Projectemployee } from './pages/projectemployee/projectemployee';
import { Attendance } from './pages/attendance/attendance';
import { EmployeeDetail } from './pages/employee-detail/employee-detail';
import { adminGuard } from './core/guards/admin.guard';
import { Registration } from './pages/registration/registration';

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
    path: 'registration',
    component: Registration,
  },
  {
    path: '',
    component: Layout,
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
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
        path: 'employee-detail',
        component: EmployeeDetail,
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
