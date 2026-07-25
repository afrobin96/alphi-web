import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Sidebar } from "../../components/shared/sidebar/sidebar";
import { Topnavbar } from '../../components/shared/topnavbar/topnavbar';
import { SidebarService } from '../../components/shared/sidebar/sidebar-service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, Sidebar, Topnavbar],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  sidebarService = inject(SidebarService);
  private auth = inject(AuthStore);

   logout() {
    this.auth.logOut();
    window.location.href = '/login';
  }
}
