import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, MatSidenavModule, MatToolbar, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {

  private auth = inject(AuthStore);

   logout() {
    this.auth.logOut();
    window.location.href = '/login';
  }
}
