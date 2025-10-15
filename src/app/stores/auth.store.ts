import { computed, Injectable, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";


@Injectable({
  providedIn: 'root',
})
export class AuthStore {

  private tokenSig = signal<string | null>(localStorage.getItem('token'));
  private usersig = signal<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  readonly isAuthenticated = computed(()=> !!this.tokenSig());
  readonly token = computed(()=> this.tokenSig());
  readonly user = computed(()=> this.usersig());


  setAuth(token: string, user: User){
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.tokenSig.set(token);
    this.usersig.set(user);
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.tokenSig.set(null);
    this.usersig.set(null);
  }
}
