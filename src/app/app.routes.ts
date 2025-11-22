import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth.guard';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { ProjectsList } from './components/admin/projects/projects-list/projects-list';
import { ProjectsForm } from './components/admin/projects/projects-form/projects-form';
import { ClientList } from './components/admin/clients/client-list/client-list';
import { ClientForm } from './components/admin/clients/client-form/client-form';
import { TeamsList } from './components/admin/teams/teams-list/teams-list';
import { TeamsForm } from './components/admin/teams/teams-form/teams-form';
import { MembersList } from './components/admin/members/members-list/members-list';
import { MembersForm } from './components/admin/members/members-form/members-form';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin,
    children:[
      { path: 'dashboard', component: Dashboard },
      { path: 'projects', component: ProjectsList},
      { path: 'projects/new', component: ProjectsForm},
      { path: 'clients', component: ClientList },
      { path: 'clients/new', component: ClientForm},
      { path: 'teams', component: TeamsList },
      { path: 'teams/new', component: TeamsForm},
      { path: 'members', component: MembersList },
      { path: 'members/new', component: MembersForm },
      { path: 'tasks', component: Dashboard },
      { path: 'payments', component: Dashboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
