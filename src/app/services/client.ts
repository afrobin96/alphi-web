import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { ClientData } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly apiUrl = `${environment.apiUrl}/client`;
  injectedHttp = inject(HttpClient);

  clients = signal<ClientData[]>([]);

  loadAll(){
    this.injectedHttp.get<ClientData[]>(this.apiUrl).subscribe((res)=>this.clients.set(res));
  }

  create(data: Partial<ClientData>){
    return this.injectedHttp.post<ClientData>(this.apiUrl, data);
  }

  update(id:number, data: Partial<ClientData>){
    return this.injectedHttp.put<ClientData>(`${this.apiUrl}/${id}`, data);
  }

  delete(id:number){
    this.injectedHttp.delete(`${this.apiUrl}/${id}`);
  }

}
