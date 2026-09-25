import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { catchError, Observable, switchMap } from 'rxjs';
import { GenerateInstructionalData } from '../interfaces/generateInstructional';
import { LearnerProfile } from '../interfaces/learner-profile.interface';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProfile(): Observable<LearnerProfile> {
    return this.http.get<LearnerProfile>(`${this.apiUrl}/auth/profile`);
  }

  generatePdf(dto: GenerateInstructionalData): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/instructional-designer/generate`,
      dto,
      { responseType: 'blob', observe: 'response' },
    ).pipe(
      switchMap((res) => new Observable<Blob>(observer => {
        observer.next(res.body as Blob);
        observer.complete();
      })),
      catchError((err) => {
        const blob: Blob = err.error;
        return new Observable<Blob>(observer => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const json = JSON.parse(reader.result as string);
              observer.error({ ...err, error: json });
            } catch {
              observer.error(err);
            }
          };
          reader.onerror = () => observer.error(err);
          reader.readAsText(blob);
        });
      }),
    ) as Observable<Blob>;
  }

  // Plan FREE: renovar tokens mensuales
  renewFree(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/renew-free`, {});
  }

  // Plan pago: actualizar suscripción
  upgradePlan(plan: 'starter' | 'pro'): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/upgrade-plan`, { plan });
  }
}
