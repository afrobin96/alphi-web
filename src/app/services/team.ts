import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { TeamData } from '../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiUrl = `${environment.apiUrl}/team`;
  injectedHttp = inject(HttpClient);

  teams = signal<TeamData[]>([]);

  loadAll(){
    return this.injectedHttp.get<TeamData[]>(this.apiUrl).subscribe((res)=> this.teams.set(res));
  }

  create(data: Partial<TeamData>){
    return this.injectedHttp.post<TeamData>(this.apiUrl, data);
  }

  update(id: number, data: Partial<TeamData>){
    return this.injectedHttp.put<TeamData>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number){
    return this.injectedHttp.delete(`${this.apiUrl}/${id}`);
  }
}
