import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
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
}
