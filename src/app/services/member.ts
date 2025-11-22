import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberData } from '../interfaces/members.interface';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly apiUrl = `${environment.apiUrl}/member`;
  injectedHttp = inject(HttpClient);

  list(): Observable<MemberData[]>{
    return this.injectedHttp.get<MemberData[]>(this.apiUrl);
  }

  create(payload:Partial<MemberData>){
    return this.injectedHttp.post<MemberData>(this.apiUrl, payload);
  }

  get(id: number){
    return this.injectedHttp.get<MemberData>(`${this.apiUrl}/${id}`);
  }

  update(id: number, payload: Partial<MemberData>){
    return this.injectedHttp.put<MemberData>(`${this.apiUrl}/${id}`, payload);
  }

  remove(id:number){
    return this.injectedHttp.delete(`${this.apiUrl}/${id}`);
  }

  assignTeam(memberId: number, teamid: number){
    return this.injectedHttp.post<MemberData>(`${this.apiUrl}/${memberId}/team`, {id: teamid})
  }
}
