import { Component, OnInit } from '@angular/core';
import { UserData } from '../../../interfaces/user.interface';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-topnavbar',
  imports: [],
  templateUrl: './topnavbar.html',
  styleUrl: './topnavbar.scss'
})
export class Topnavbar implements OnInit{
    user: UserData | null =  null;
    userInitials = '';

  constructor(private authService: Auth) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.userInitials = this.getInitials(this.user?.username);
  }

  private getInitials(username?: string): string {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
  }
}
