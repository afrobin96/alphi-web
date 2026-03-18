import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentStore } from '../../../../stores/payment.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProjectStore } from '../../../../stores/project.store';
import { MemberStore } from '../../../../stores/member.store';
import { TaskStore } from '../../../../stores/task.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alert } from '../../../shared/alert/alert';
import { AlertService } from '../../../../services/shared/alert';

@Component({
  selector: 'app-payments-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe, Alert],
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
  private alertService = inject(AlertService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  editing = false;

  projects = this.projectStore.projects;
  teams = signal<{ id: number; name: string }[]>([]);
  members = signal<any[]>([]);
  amounts = signal<number>(0);
  tasksPreview = signal<any[]>([]);


  form = this.fb.group({
    projectId: [null as number | null, Validators.required],
    teamId:    [null as number | null, Validators.required],
    memberId:  [null as number | null, Validators.required],
    note: [''],
  });

  projectIdSig = toSignal(
    this.form.controls.projectId.valueChanges,
    { initialValue: null }
  );

  teamIdSig = toSignal(
    this.form.controls.teamId.valueChanges,
    { initialValue: null }
  );

  memberIdSig = toSignal(
    this.form.controls.memberId.valueChanges,
    { initialValue: null }
  );

  hasTasksForPayment = computed(() => {
    const projectId = Number(this.projectIdSig());
    const memberId  = Number(this.memberIdSig());

    if (!projectId || !memberId) return true;

    return this.tasksStore.tasks().some(t =>
      t.project?.id === projectId &&
      t.member?.id  === memberId  &&
      (t.status === 'completed' || t.status === 'payment_pending')
    );
  });

  constructor() {
    this.projectStore.load();
    this.membersStore.load();
    this.tasksStore.load();

    // Cuando cambia el proyecto → filtrar equipo
    effect(() => {
      const projectId = this.projectIdSig();

      // Reseteo datos.
      this.teams.set([]);
      this.members.set([]);
      this.amounts.set(0);
      this.tasksPreview.set([]);

      this.form.controls.teamId.setValue(null,   { emitEvent: false });
      this.form.controls.memberId.setValue(null, { emitEvent: false });

      if (!projectId) {
        return;
      }

      const project = this.projectStore.projects()
        .find(p => p.id === Number(projectId));

      if (!project?.team?.id) {
        return;
      }

      this.teams.set([{ id: project.team.id, name: project.team.name }]);

      this.form.controls.teamId.setValue(project.team.id, { emitEvent: true });
    });

    // Cuando cambia equipo → filtrar miembros de ese equipo
    effect(() => {
      const teamId     = this.teamIdSig();
      const allMembers = this.membersStore.members();

      this.members.set([]);
      this.amounts.set(0);
      this.tasksPreview.set([]);
      this.form.controls.memberId.setValue(null, { emitEvent: false });

      if (!teamId) return;

      const filtered = allMembers.filter(m => m.teamId?.id === Number(teamId));
      this.members.set(filtered);
    });

    // Cuando cambia el miembro → calcular total
    effect(() => {

      const projectId = Number(this.projectIdSig());
      const memberId  = Number(this.memberIdSig());

      if (!projectId || !memberId) {
        this.amounts.set(0);
        this.tasksPreview.set([]);
        return;
      }

      const completedTasks = this.tasksStore.tasks().filter(t =>
        t.project?.id === projectId &&
        t.member?.id  === memberId  &&
        (t.status === 'completed' || t.status === 'payment_pending')
      );

      this.amounts.set(completedTasks.reduce((sum, t) => sum + Number(t.value), 0));
      this.tasksPreview.set(completedTasks);

      if (completedTasks.length === 0) {
        this.alertService.show('danger', 'Este miembro no tiene tareas completadas en el proyecto seleccionado. No es posible generar un pago.');
      }
    });
  }

  onSubmit(){
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
      },
      error: (err) => console.error('Error al crear el pago', err),
    });
  }



}
