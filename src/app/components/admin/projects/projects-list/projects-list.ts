import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../../../stores/project.store';
import { Router, RouterLink } from '@angular/router';
import { ProjectData } from '../../../../interfaces/project.interface';
import { Loader } from "../../../shared/loader/loader";

@Component({
  selector: 'app-projects-list',
  imports: [Loader, RouterLink],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList implements OnInit{

  projectStore = inject(ProjectStore);
  router = inject(Router);

  projects = this.projectStore.projects;
  loading = this.projectStore.loading;

  ngOnInit(): void {
    this.projectStore.load();
  }

  edit(project: ProjectData){
    this.router.navigateByUrl(`/admin/projects/edit/${project.id}`);
  }

  remove(id: number){
    if (!confirm('¿Deseas eliminar el proyecto?')) return;
    this.projectStore.remove(id).subscribe;
  }

  complete(id:number){
    if (!confirm('¿Deseas marcar el proyecto como completado?')) return;
    this.projectStore.complete(id).subscribe;
  }

}
