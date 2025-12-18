import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentStore } from '../../../../stores/payment.store';
import { PaymentService } from '../../../../services/payment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project';
import { N } from '@angular/cdk/keycodes';
import { DecimalPipe } from '@angular/common';
import { ProjectStore } from '../../../../stores/project.store';
import { MemberStore } from '../../../../stores/member.store';
import { TaskStore } from '../../../../stores/task.store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-payments-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './payments-form.html',
  styleUrl: './payments-form.scss'
})
export class PaymentsForm {
  selectedPayment = input<any | null>(null);

  private fb = inject(FormBuilder);
  private paymentStore = inject(PaymentStore);
  private projectStore = inject(ProjectStore);
  private membersStore = inject(MemberStore);
  private tasksStore = inject(TaskStore);
  private paymentService = inject(PaymentService);
  private projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editing = false;

  projects = this.projectStore.projects;
  members = signal<any[]>([]);
  amounts = signal<number | null>(null);
  tasksPreview = signal<any[]>([]);


  form = this.fb.group({
    memberId: [null, Validators.required],
    projectId: [null, Validators.required],
    note: [''],
  });

  projectIdSig = toSignal(
    this.form.controls.projectId.valueChanges,
    { initialValue: null }
  );

  memberIdSig = toSignal(
    this.form.controls.memberId.valueChanges,
    { initialValue: null }
  );

  constructor() {
    this.projectStore.load();
    this.membersStore.load();
    this.tasksStore.load();

    // Cuando cambia el proyecto → filtrar miembros por equipo
    effect(() => {
      const projectId = this.projectIdSig();
      const allMembers = this.membersStore.members(); // Dependencia para re-ejecutar cuando cargan los miembros
      console.log('Project changed:', projectId);
      if (!projectId) {
        this.members.set([]);
        return;
      }

      const project = this.projectStore.projects()
        .find(p => p.id === Number(projectId));

      if (!project?.team?.id) {
        this.members.set([]);
        return;
      }

      const teamId = project.team.id;

      const filteredMembers = allMembers
        .filter(m => m.teamId?.id === teamId);

      this.members.set(filteredMembers);
      this.form.patchValue({ memberId: null });
    });

    // Cuando cambia el miembro → calcular total
    effect(() => {
      const projectId = Number(this.form.value.projectId);
      const memberId = Number(this.form.value.memberId);

      if (!projectId || !memberId) {
        this.amounts.set(0);
        return;
      }

      const total = this.tasksStore.tasks()
        .filter(t =>
          t.project?.id === projectId &&
          t.member?.id === memberId &&
          t.status === 'completed'
        )
        .reduce((sum, t) => sum + Number(t.value), 0);

      this.amounts.set(total);
    });
  }

  OnSubmit(){
    if (this.form.invalid) return;

    const value = this.form.value;

    const payload = {
      memberId: Number(value.memberId),
      projectId: Number(value.projectId),
      note: value.note || '',
    }

    this.paymentStore.add(payload).subscribe({
      next: () => {
        this.form.reset();
        this.router.navigateByUrl('admin/payments');
      }
    });
  }



}
