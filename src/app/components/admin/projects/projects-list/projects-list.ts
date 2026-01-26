import { Component, inject, OnInit } from '@angular/core';
import { ProjectStore } from '../../../../stores/project.store';
import { Router, RouterLink } from '@angular/router';
import { ProjectData } from '../../../../interfaces/project.interface';
import { Loader } from "../../../shared/loader/loader";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-projects-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList implements OnInit{

  projectStore = inject(ProjectStore);
  router = inject(Router);

  projects = this.projectStore.projects;
  loading = this.projectStore.loading;

  displayedColumns: string[] = ['name', 'client', 'team', 'status', 'actions'];

  ngOnInit(): void {
    this.projectStore.load();
  }

  edit(project: ProjectData){
    this.router.navigateByUrl(`/admin/projects/edit/${project.id}`);
  }

  remove(id: number){
    if (!confirm('¿Deseas eliminar el proyecto?')) return;
    this.projectStore.remove(id).subscribe();
  }

  complete(id:number){
    if (!confirm('¿Deseas marcar el proyecto como completado?')) return;
    this.projectStore.complete(id).subscribe();
  }

}
