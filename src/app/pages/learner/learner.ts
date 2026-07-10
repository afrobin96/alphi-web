import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-learner',
  imports: [RouterOutlet, MatSidenavModule, MatToolbar, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './learner.html',
  styleUrl: './learner.scss'
})
export class Learner {
  private auth = inject(AuthStore);

  readonly username = this.auth.user()?.username ?? '';

  logout() {
    this.auth.logOut();
    window.location.href = '/login';
  }
}
