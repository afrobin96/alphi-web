import { inject, Injectable, signal } from "@angular/core";
import { TaskData } from "../interfaces/task.interface";
import { TaskService } from "../services/task";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TaskStore{
  private _tasks= signal<TaskData[]>([]);
  tasks = this._tasks.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  taskService = inject(TaskService);

  load(){
    this._loading.set (true);
    this.taskService.list().pipe(
      tap({
        next: (tasks) => {
          this._tasks.set(tasks);
          this._loading.set(false);
        },
        error: () => { this._loading.set(false); }
      })
    ).subscribe();
  }

  add(task: Partial<TaskData>){
    return this.taskService.create(task).pipe(
      tap((newTask) => {
        this._tasks.update((tasks) => [...tasks, newTask]);
      })
    );
  }

  update(id: number, task: Partial<TaskData>){
    return this.taskService.update(id, task).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
      })
    );
  }

  delete(id: number){
    return this.taskService.remove(id).pipe(
      tap(() => {
        this._tasks.update((tasks) => tasks.filter((t) => t.id !== id));
      })
    );
  }

  assignMember(taskId: number, memberId: number){
    return this.taskService.assignMember(taskId, memberId).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
      })
    );
  }

  assignProject(taskId: number, projectId: number){
    return this.taskService.assignProject(taskId, projectId).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
      })
    );
  }

  changeStatus(taskId: number, status: string){
    return this.taskService.changeStatus(taskId, status).pipe(
      tap((updatedTask) => {
        this._tasks.update((tasks) => tasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
      })
    );
  }
}
