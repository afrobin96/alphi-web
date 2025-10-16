import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { User } from "../interfaces/user.interface";


@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private platformId = inject(PLATFORM_ID);
  private tokenSig = signal<string | null>(null);
  private usersig = signal<User | null>(null);

  constructor(){
    effect(() => {
      if(isPlatformBrowser(this.platformId)){
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        this.tokenSig.set(token);
        this.usersig.set(user ? JSON.parse(user) : null);
      }
    });
  }

  readonly isAuthenticated = computed(()=> !!this.tokenSig());
  readonly token = computed(()=> this.tokenSig());
  readonly user = computed(()=> this.usersig());


  setAuth(token: string, user: User){
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.tokenSig.set(token);
    this.usersig.set(user);
  }

  logOut(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.tokenSig.set(null);
    this.usersig.set(null);
  }
}
