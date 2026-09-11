import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Topnavbar } from "../../components/shared/topnavbar/topnavbar";
import { SidebarService } from '../../components/shared/sidebar/sidebar-service';

@Component({
  selector: 'app-learner',
  imports: [RouterOutlet, Sidebar, Topnavbar],
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
