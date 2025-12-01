import { Component, inject, signal } from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../../../services/project';
import { MemberService } from '../../../../services/member';
import { title } from 'process';

@Component({
  selector: 'app-tasks-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tasks-form.html',
  styleUrl: './tasks-form.scss'
})
export class TasksForm {

  fb = inject(FormBuilder);
  taskService = inject(TaskService);
  taskStore = inject(TaskStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  httpClient = inject(HttpClient);
  projectService = inject(ProjectService);
  memberService = inject(MemberService);

  loading = this.taskStore.loading;

  projects = signal<any[]>([]);
  members = signal<any[]>([]);

  editing = false;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    value: [0, Validators.required],
    projectId: null,
    memberId: null,
    status: ['to_do']
  });

  constructor(){
    this.projectService.list().subscribe(project => this.projects.set(project));
    this.memberService.list().subscribe(member => this.members.set(member));
  }

  onSubmit(){
      if(this.form.invalid) return;

      const value = this.form.value;

      const payload: any = {
        title: value.title,
        description: value.description,
        value: Number(value.value) || 0,
        projectId: value.projectId ? Number(value.projectId) : undefined,
        memberId: value.memberId ? Number(value.memberId) : undefined,
      }

      this.taskStore.add(payload).subscribe(() => {
        this.router.navigateByUrl('admin/tasks');
      });

      this.form.reset();
  }
}
