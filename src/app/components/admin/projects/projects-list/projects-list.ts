import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ProjectStore } from '../../../../stores/project.store';
import { Router } from '@angular/router';
import { ProjectData } from '../../../../interfaces/project.interface';
import { Loader } from "../../../shared/loader/loader";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ProjectsForm } from '../projects-form/projects-form';
@Component({
  selector: 'app-projects-list',
  imports: [Loader, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, ProjectsForm],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss'
})
export class ProjectsList implements OnInit{

  projectStore = inject(ProjectStore);
  router = inject(Router);

  projects = this.projectStore.projects;
  loading = this.projectStore.loading;

  // null = modal cerrado | undefined = crear nuevo | ProjectData = editar
  selectedProject = signal<ProjectData | null | undefined>(undefined);

  displayedColumns: string[] = ['name', 'client', 'team', 'status', 'actions'];

  dataSource = new MatTableDataSource<ProjectData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.projects();
    });

    // Solo se filtra por nombre.
    this.dataSource.filterPredicate = (project: ProjectData, filter: string) => {
      return (project.name ?? '').toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {
    this.projectStore.load();
  }

  openProjectModal(): void {
    this.selectedProject.set(null); // null = modo crear
  }

  editProjectModal(project: ProjectData): void {
    this.selectedProject.set(project); // proyecto = modo editar
  }

  closeModal(): void {
    this.selectedProject.set(undefined); // undefined = cerrado
    this.projectStore.load();
  }

  isModalOpen(): boolean {
    return this.selectedProject() !== undefined;
  }

  remove(id: number){
    if (!confirm('¿Deseas eliminar el proyecto?')) return;
    this.projectStore.remove(id).subscribe();
  }

  complete(id:number){
    if (!confirm('¿Deseas marcar el proyecto como completado?')) return;
    this.projectStore.complete(id).subscribe();
  }

  filterProjectsTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
