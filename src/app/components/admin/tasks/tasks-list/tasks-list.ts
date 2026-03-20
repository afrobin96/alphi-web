import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentStore } from '../../../../stores/payment.store';
import { TaskData } from '../../../../interfaces/task.interface';
import { ModalPayment } from '../modal-payment/modal-payment';
import { PaymentData } from '../../../../interfaces/payments.interface';

@Component({
  selector: 'app-tasks-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule, ModalPayment],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss'
})
export class TasksList implements OnInit {

  paymentStore = inject(PaymentStore);
  taksStore = inject(TaskStore);
  router = inject(Router);

  loading = this.taksStore.loading;
  tasks = this.taksStore.tasks;
  payments = this.paymentStore.payments;

  selectedPayment = signal<PaymentData | null>(null);

  displayedColumns: string[] = ['title', 'value', 'state', 'project', 'member', 'actions'];

  // Map de taskId -> paymentId para búsqueda rápida en el template
  taskPaymentMap = computed(() => {
    const map = new Map<number, PaymentData>();
    this.payments().forEach((payment) => {
      payment.tasks?.forEach((task) => {
        if (task.id !== undefined) {
          map.set(task.id, payment);
        }
      });
    });

    return map;
  });

  ngOnInit(): void {
    this.taksStore.load();
    this.paymentStore.load();
  }

  getPaymentId(taskId: number): PaymentData | undefined {
    return this.taskPaymentMap().get(taskId);
  }

  openPaymentModal(taskId: number): void {
    const payment = this.getPaymentId(taskId);
    if (payment) this.selectedPayment.set(payment);
  }

  closePaymentModal(): void {
    this.selectedPayment.set(null);
  }

  edit(task: TaskData): void {
    this.router.navigateByUrl(`/admin/tasks/edit/${task.id}`);
  }

  delete(id: number): void{
    if (!confirm('¿Deseas eliminar la tarea?')) return;
    this.taksStore.delete(id).subscribe();
  }

  assignMember(taskId: number, memberId: number): void {
    this.taksStore.assignMember(taskId, Number(memberId)).subscribe();
  }

  assignProject(taskId: number, projectId: number): void {
    this.taksStore.assignProject(taskId, Number(projectId)).subscribe();
  }

  changeStatus(taskId: number, status: string): void {
    this.taksStore.changeStatus(taskId, status).subscribe();
  }

  goToCreatePayment(): void {
    this.router.navigateByUrl(`/admin/payments/new`);
  }

}
