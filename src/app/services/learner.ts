import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { Observable } from 'rxjs';
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
      { responseType: 'blob' }
    );
  }
}
