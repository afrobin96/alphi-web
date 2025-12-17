import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentStore } from '../../../../stores/payment.store';
import { PaymentService } from '../../../../services/payment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project';
import { N } from '@angular/cdk/keycodes';
import { DecimalPipe } from '@angular/common';

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
  private paymentService = inject(PaymentService);
  private projectService = inject(ProjectService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editing = false;

  projects = signal<any[]>([]);
  members = signal<any[]>([]);
  amounts = signal<number | null>(null);
  tasksPreview = signal<any[]>([]);

  form = this.fb.group({
    memberId: [null, Validators.required],
    projectId: [null, Validators.required],
    note: [''],
  });

  constructor() {
    this.projectService.list().subscribe((project) => this.projects.set(project));

    effect(() => {
      const projectId = this.form.value.projectId;
      if (!projectId) {
        this.members.set([]);
        this.amounts.set(null);
        this.tasksPreview.set([]);
        return;
      }

      this.paymentService.getProjectMembers(Number(projectId)).subscribe((members) => this.members.set(members));

      this.form.patchValue({ memberId: null });
      this.amounts.set(null);
      this.tasksPreview.set([]);
    });

    effect(() => {
      const projectid = this.form.value.projectId;
      const memberId = this.form.value.memberId;

      if (!projectid || !memberId) {
        this.amounts.set(null);
        this.tasksPreview.set([]);
        return;
      }
      this.paymentService.calcAmount(Number(projectid), Number(memberId)).subscribe(amount => {
        this.amounts.set(Number(amount.total));
        this.tasksPreview.set(amount.tasks || []);
      });
    });

    effect(() => {
      const slected = this.selectedPayment();
      if(!slected){
        this.form.reset();
        this.amounts.set(null);
        this.tasksPreview.set([]);
        return;
      }

      this.form.patchValue({
        memberId: slected.member.id ?? null,
        projectId: slected.project.id ?? null,
        note: slected.note ?? '',
      });

      this.amounts.set(slected.total ?? null);
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
