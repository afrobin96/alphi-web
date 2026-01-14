import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tasks-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss'
})
export class TasksList implements OnInit {

  // tasks = signal<any | null>(null);
  taksStore = inject(TaskStore);
  router = inject(Router);

  loading = this.taksStore.loading;
  tasks = this.taksStore.tasks;

  displayedColumns: string[] = ['title', 'value', 'state', 'project', 'member', 'actions'];

  ngOnInit(): void {
    this.taksStore.load();
  }

  edit(task: any){
    this.router.navigateByUrl(`/admin/tasks/edit/${task.id}`);
  }

  delete(id: number){
    if (!confirm('¿Deseas eliminar la tarea?')) return;
    this.taksStore.delete(id).subscribe;
  }

  assignMember(taskId: number, memberId: number){
    this.taksStore.assignMember(taskId, Number(memberId)).subscribe();
  }

  assignProject(taskId: number, projectId: number){
    this.taksStore.assignProject(taskId, Number(projectId)).subscribe();
  }

  changeStatus(taskId: number, status: string){
    this.taksStore.changeStatus(taskId, status).subscribe();
  }

}
