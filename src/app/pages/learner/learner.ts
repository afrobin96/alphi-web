import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Topnavbar } from "../../components/shared/topnavbar/topnavbar";
import { SidebarService } from '../../components/shared/sidebar/sidebar-service';

@Component({
  selector: 'app-learner',
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, Sidebar, Topnavbar],
  templateUrl: './learner.html',
  styleUrl: './learner.scss'
})
export class Learner {
  private auth = inject(AuthStore);

  sidebarService = inject(SidebarService);

  readonly username = this.auth.user()?.username ?? '';

  logout() {
    this.auth.logOut();
    window.location.href = '/login';
  }
}
