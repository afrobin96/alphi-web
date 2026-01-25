import { inject, Injectable, signal } from "@angular/core";
import { ProjectData } from "../interfaces/project.interface";
import { ProjectService } from "../services/project";
import { tap } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class ProjectStore {
  private _projects = signal<ProjectData[]>([]);
  projects = this._projects.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  projectService = inject(ProjectService);

  load(){
    this._loading.set(true);
    this.projectService.list().pipe(
      tap({
        next: (res) => {
          this._projects.set(res);
          this._loading.set(false);
        },
        error: () => this._loading.set(false)
      })
    ).subscribe();
  }

  add(project: Partial<ProjectData>){
    return this.projectService.create(project).pipe(
      tap((project)=> this._projects.update(curr => [project, ...curr]))
    )
  }

  update(id: number, payload: Partial<ProjectData>){
    console.log('ProjectStore update', id, payload);
    return this.projectService.update(id, payload).pipe(
      tap((project)=> this._projects.update(curr => curr.map(c => c.id === project.id ? project : c)))
    )
  }

  remove(id:number){
    return this.projectService.remove(id).pipe(
      tap(()=> this._projects.update(curr=> curr.filter(c => c.id !== id)))
    )
  }

  assignTeam(projectId: number, teamId:number){
    return this.projectService.assingTeam(projectId,teamId).pipe(
      tap((project: any) => this._projects.update(curr=> curr.map(c=> c.id === projectId ? project : c)))
    )
  }

  assignClient(projectId: number, clientId:number){
    return this.projectService.assingClient(projectId,clientId).pipe(
      tap((project: any) => this._projects.update(curr=> curr.map(c=> c.id === projectId ? project : c)))
    )
  }

  complete(id:number){
    return this.projectService.complete(id).pipe(
      tap((project: any) => this._projects.update(curr => curr.map(c => c.id === id ? project : c )))
    )
  }
}
