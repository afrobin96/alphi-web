import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectData } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.apiUrl}/project`;
  injectedHttp = inject(HttpClient);

  create(payload: Partial<ProjectData>): Observable<ProjectData>{
    return this.injectedHttp.post<ProjectData>(this.apiUrl, payload);
  }

  list(){
    return this.injectedHttp.get<ProjectData[]>(this.apiUrl);
  }

  get(id: number){
    return this.injectedHttp.get<ProjectData>(`${this.apiUrl}/${id}`);
  }

  update(id: number, payload: Partial<ProjectData>){
    return this.injectedHttp.put<ProjectData>(`${this.apiUrl}/${id}`,  payload);
  }

  remove(id: number){
    return this.injectedHttp.delete(`${this.apiUrl}/${id}`);
  }

  assingTeam(projectId: number, teamId: number){
    return this.injectedHttp.post(`${this.apiUrl}/${projectId}/team`, {id: teamId} );
  }

  assingClient(projectId: number, clientId: number){
    return this.injectedHttp.post(`${this.apiUrl}/${projectId}/client`, {id: clientId} );
  }

  complete(id: number){
    return this.injectedHttp.post(`${this.apiUrl}/${id}/complete`, {});
  }
}
