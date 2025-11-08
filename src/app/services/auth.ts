import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private httpClient: HttpClient){}

  login(username: string, password: string): Observable<LoginData>{
    return this.httpClient.post<LoginData>(this.apiUrl, {username, password});
  }
}
