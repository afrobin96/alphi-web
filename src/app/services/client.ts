import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { ClientData } from '../interfaces/client.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiUrl = `${environment.apiUrl}/client`;
  injectedHttp = inject(HttpClient);

  clients = signal<ClientData[]>([]);

  loadAll(): Observable<ClientData[]> {
    return this.injectedHttp.get<ClientData[]>(this.apiUrl);
  }

  get(id: number){
      return this.injectedHttp.get<ClientData>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<ClientData>): Observable<ClientData>{
    return this.injectedHttp.post<ClientData>(this.apiUrl, data);
  }

  update(id:number, data: Partial<ClientData>): Observable<ClientData>{
    return this.injectedHttp.put<ClientData>(`${this.apiUrl}/${id}`, data);
  }

  delete(id:number): Observable<void>{
    return this.injectedHttp.delete<void>(`${this.apiUrl}/${id}`);
  }

}
