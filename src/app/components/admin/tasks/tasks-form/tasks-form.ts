import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from '../../../../services/project';
import { MemberService } from '../../../../services/member';
import { TaskData, TaskStatus, TaskStatusMap, TaskStatusOption } from '../../../../interfaces/task.interface';
import { switchMap, of } from 'rxjs';

const TASK_STATUS_MAP: TaskStatusMap = {
  to_do:           { label: 'Por hacer',          transitions: ['in_course'] },
  in_course:       { label: 'En progreso',         transitions: ['in_review'] },
  in_review:       { label: 'En revisión',         transitions: ['completed', 'reopened'] },
  reopened:        { label: 'Reabierta',           transitions: ['in_course'] },
  completed:       { label: 'Completada',          transitions: ['payment_pending'] },
  payment_pending: { label: 'En proceso de pago',  transitions: ['paid'] },
  paid:            { label: 'Pagada',              transitions: [] },
};

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

  currentStatus = signal<TaskStatus>('to_do');

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    value: [0, Validators.required],
    projectId: [null as number | null],
    memberId: [null as number | null],
    status: ['to_do' as TaskStatus],
  });

  availableStatuses = computed<TaskStatusOption[]>(() => {
    if (!this.editing) {
      return [{ value: 'to_do', label: TASK_STATUS_MAP['to_do'].label }];
    }

    const current = this.currentStatus();
    const allowed: TaskStatus[] = [current, ...TASK_STATUS_MAP[current].transitions];

    return allowed.map((status) => ({ value: status, label: TASK_STATUS_MAP[status].label }));
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
        this.currentStatus.set(task.status as TaskStatus);
        this.form.patchValue({
          title: task.title,
          description: task.description,
          value: task.value,
          projectId:
            this.projects().find((p) => p.id === task.project?.id)?.id ?? null,
          memberId:
            this.members().find((m) => m.id === task.member?.id)?.id ?? null,
          status: task.status as TaskStatus,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const value = this.form.value;

    const projectId = value.projectId ? Number(value.projectId) : null;
    const memberId = value.memberId ? Number(value.memberId) : null;
    const newStatus = value.status as TaskStatus;

    if (this.editing && this.taskId) {

      const taskId = this.taskId;

      this.taskService
        .update(taskId, {
          title: value.title!,
          description: value.description!,
          value: Number(value.value) || 0,
        }).pipe(
          switchMap(() => {
            if (newStatus !== this.currentStatus()) {
              return this.taskStore.changeStatus(taskId, newStatus);
            }
            return of(null);
          }),
          switchMap(() => {
               if (projectId !== null) {
                return this.taskStore.assignProject(taskId, projectId);
              }
              return of(null);
          }),
          switchMap(() => {
            if (memberId !== null) {
              return this.taskStore.assignMember(taskId, memberId);
            }
            return of(null);
          }),
        ).subscribe({
          next: () => this.router.navigateByUrl('admin/tasks'),
          error: (err) => console.error('Error al actualizar la tarea', err),
        });
    } else {
      const payload: TaskData = {
        title: value.title!,
        description: value.description!,
        value: Number(value.value) || 0,
        project: this.projects().find((p) => p.id === projectId) ?? null,
        member: this.members().find((m) => m.id === memberId) ?? null,
        status: 'to_do' as TaskStatus,
      };

      this.taskStore.add(payload).subscribe(() => {
        this.form.reset();
        this.router.navigateByUrl('admin/tasks');
      });
    }
  }
}
