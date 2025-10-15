import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment.develop';

export interface ContactForm {
  nombre: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient){}

  SendMessage(data: ContactForm): Observable<any>{
    return this.http.post(this.apiUrl, data);
  }
}
