import { Component, inject } from '@angular/core';
import { SidebarService } from './sidebar-service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  sidebarService = inject(SidebarService);

  toggleSidebarCollapse(): void {
    this.sidebarService.toggle();
  }
}
