import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-admin',
  imports: [],
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
