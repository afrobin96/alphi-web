import { Component, inject, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/user.interface';
import { Auth } from '../../../services/auth';
import { AuthStore } from '../../../stores/auth.store';

@Component({
  selector: 'app-topnavbar',
  imports: [],
  templateUrl: './topnavbar.html',
  styleUrl: './topnavbar.scss'
})
export class Topnavbar implements OnInit{
    user: UserData | null =  null;
    userInitials = '';
    private auth = inject(AuthStore);

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.userInitials = this.getInitials(this.user?.username);
  }

  private getInitials(username?: string): string {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  }

  logout() {
    this.auth.logOut();
    window.location.href = '/login';
  }
}
