import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentData } from '../interfaces/payments.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payment`;
  injectedHttp = inject(HttpClient);

  list(): Observable<PaymentData[]>{
    return this.injectedHttp.get<PaymentData[]>(this.apiUrl);
  }

  create(payload: {projectId: number, memberId: number, note?:string}){
    return this.injectedHttp.post<PaymentData>(this.apiUrl, payload);
  }

  changeStatus(id:number, status: 'pending' | 'paid' | 'cancelled'){
    return this.injectedHttp.post<PaymentData>(`${this.apiUrl}/${id}/status`, { status });
  }

  remove(id:number){
    return this.injectedHttp.delete(`${this.apiUrl}/${id}`);
  }

  calcAmount(projectId:number, memberId: number){
    const params = new HttpParams().set('projectId', String(projectId)).set('memberId', String(memberId));
    return this.injectedHttp.get<{total:number, tasks: any[]}>(`${this.apiUrl}/calc`, {params});
  }

  getProjectMembers(projectId: number){
    return this.injectedHttp.get<any[]>(`${this.apiUrl}/project/${projectId}/members`);
  }

}
