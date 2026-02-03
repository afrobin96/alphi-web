import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { TeamData } from '../interfaces/team.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiUrl = `${environment.apiUrl}/team`;
  injectedHttp = inject(HttpClient);

  teams = signal<TeamData[]>([]);

  loadAll(): Observable<TeamData[]>{
    return this.injectedHttp.get<TeamData[]>(this.apiUrl);
  }

  get(id: number){
    return this.injectedHttp.get<TeamData>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<TeamData>): Observable<TeamData>{
    return this.injectedHttp.post<TeamData>(this.apiUrl, data);
  }

  update(id: number, data: Partial<TeamData>): Observable<TeamData>{
    return this.injectedHttp.put<TeamData>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void>{
    return this.injectedHttp.delete<void>(`${this.apiUrl}/${id}`);
  }
}
