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
import { TasksList } from './components/admin/tasks/tasks-list/tasks-list';
import { TasksForm } from './components/admin/tasks/tasks-form/tasks-form';
import { PaymentsList } from './components/admin/payments/payments-list/payments-list';
import { PaymentsForm } from './components/admin/payments/payments-form/payments-form';
import { PlantillaHome } from './pages/plantilla-home/plantilla-home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'plantilla', component: PlantillaHome },
  { path: 'admin', component: Admin,
    children:[
      { path: 'dashboard', component: Dashboard },
      { path: 'projects', component: ProjectsList},
      { path: 'projects/new', component: ProjectsForm},
      { path: 'projects/edit/:id', component: ProjectsForm},
      { path: 'clients', component: ClientList },
      { path: 'clients/new', component: ClientForm},
      { path: 'clients/edit/:id', component: ClientForm},
      { path: 'teams', component: TeamsList },
      { path: 'teams/new', component: TeamsForm},
      { path: 'teams/edit/:id', component: TeamsForm},
      { path: 'members', component: MembersList },
      { path: 'members/new', component: MembersForm },
      { path: 'members/edit/:id', component: MembersForm},
      { path: 'tasks', component: TasksList },
      { path: 'tasks/new', component: TasksForm },
      { path: 'tasks/edit/:id', component: TasksForm },
      { path: 'payments', component: PaymentsList },
      { path: 'payments/new', component: PaymentsForm },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
