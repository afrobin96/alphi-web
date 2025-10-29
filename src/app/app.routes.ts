import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth.guard';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ProjectsList } from './components/admin/projects/projects-list/projects-list';
import { ProjectsForm } from './components/admin/projects/projects-form/projects-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin,
    children:[
      { path: 'dashboard', component: Dashboard },
      { path: 'projects', component: ProjectsList},
      { path: 'projects/new', component: ProjectsForm},
      { path: 'clients', component: Dashboard },
      { path: 'teams', component: Dashboard },
      { path: 'members', component: Dashboard },
      { path: 'tasks', component: Dashboard },
      { path: 'payments', component: Dashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
