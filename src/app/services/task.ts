import { inject, Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment.develop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskData } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/task`;
  injectedHttp = inject(HttpClient);

  list(): Observable<TaskData[]>{
    return this.injectedHttp.get<TaskData[]>(this.apiUrl);
  }

  create(data: Partial<TaskData>): Observable<TaskData>{
    return this.injectedHttp.post<TaskData>(this.apiUrl, data);
  }

  get(id: number): Observable<TaskData>{
    return this.injectedHttp.get<TaskData>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: Partial<TaskData>): Observable<TaskData>{
    return this.injectedHttp.put<TaskData>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: number): Observable<void>{
    return this.injectedHttp.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignMember(taskId: number, memberId: number): Observable<TaskData>{
    return this.injectedHttp.post<TaskData>(`${this.apiUrl}/${taskId}/member`, { memberId });
  }

  assignProject(taskId: number, projectId: number): Observable<TaskData>{
    return this.injectedHttp.post<TaskData>(`${this.apiUrl}/${taskId}/project`, { projectId });
  }

  changeStatus(taskId: number, status: string): Observable<TaskData>{
    return this.injectedHttp.post<TaskData>(`${this.apiUrl}/${taskId}/status`, { status });
  }
}
