import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { dashboardData } from '../interfaces/dashboard.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;
  injectedHttp = inject(HttpClient);

  getSummary(): Observable<dashboardData>{
    return this.injectedHttp.get<dashboardData>(`${this.apiUrl}/summary`);
  }

}
