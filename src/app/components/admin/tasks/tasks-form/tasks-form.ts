import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../../../services/project';
import { MemberService } from '../../../../services/member';
import { TaskStatus } from '../../../../interfaces/task.interface';

@Component({
  selector: 'app-tasks-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tasks-form.html',
  styleUrl: './tasks-form.scss',
})
export class TasksForm implements OnInit {
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
  taskId?: number;

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    value: [0, Validators.required],
    projectId: null,
    memberId: null,
    status: ['to_do'],
  });

  ngOnInit(): void {
    this.projectService
      .list()
      .subscribe((project) => this.projects.set(project));

    this.memberService.list().subscribe((member) => this.members.set(member));

    const id = +this.route.snapshot.paramMap.get('id')!;

    if (id) {
      this.editing = true;
      this.taskId = id;
      this.taskService.get(id).subscribe((task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          value: task.value,
          projectId:
            this.projects().find((p) => p.id === task.project?.id)?.id ?? null,
          memberId:
            this.members().find((m) => m.id === task.member?.id)?.id ?? null,
          status: task.status,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const value = this.form.value;
    console.log(value);
    const projectId = value.projectId ? Number(value.projectId) : null;
    const memberId = value.memberId ? Number(value.memberId) : null;

    if (this.editing && this.taskId) {

      this.taskService
        .update(this.taskId, {
          title: value.title!,
          description: value.description!,
          value: Number(value.value) || 0,
          status: value.status as TaskStatus,
        })
        .subscribe({
          next: () => {
            if (projectId !== null) {
              this.taskStore.assignProject(this.taskId!, projectId).subscribe();
            }
            if (memberId !== null) {
              this.taskStore.assignMember(this.taskId!, memberId).subscribe();
            }
            this.router.navigateByUrl('admin/tasks');
          },
        });

      // this.router.navigateByUrl('admin/tasks');
    } else {
      const payload: any = {
        title: value.title,
        description: value.description,
        value: Number(value.value) || 0,
        projectId: projectId,
        memberId: memberId,
        status: (value.status as TaskStatus) || 'to_do',
      };

      this.taskStore.add(payload).subscribe(() => {
        this.router.navigateByUrl('admin/tasks');
      });

      this.form.reset();
      this.router.navigateByUrl('admin/tasks');
    }
  }
}
