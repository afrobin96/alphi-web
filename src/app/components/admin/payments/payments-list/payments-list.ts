import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaymentStore } from '../../../../stores/payment.store';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { PaymentData } from '../../../../interfaces/payments.interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProjectStore } from '../../../../stores/project.store';

@Component({
  selector: 'app-payments-list',
  imports: [
    RouterLink,
    Loader,
    DecimalPipe,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './payments-list.html',
  styleUrl: './payments-list.scss'
})
export class PaymentsList implements OnInit{

  paymentStore = inject(PaymentStore);
  projectStore  = inject(ProjectStore);
  router = inject(Router);

  projects = this.projectStore.projects;
  loading = this.paymentStore.loading;

  // Señal del proyecto seleccionado para filtrar
  selectedProjectId = signal<number | null>(null);

  // Computed: filtra pagos según proyecto seleccionado
  filteredPayments = computed(() => {
    const projectId = this.selectedProjectId();
    if (!projectId) return this.paymentStore.payments();
    return this.paymentStore.payments().filter(p => p.project.id === projectId);
  });

  displayedColumns: string[] = ['id', 'member', 'project', 'value', 'status', 'date', 'actions'];

  ngOnInit(): void {
    this.paymentStore.load();
    this.projectStore.load();
  }

  onProjectFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedProjectId.set(value ? Number(value) : null);
  }

  clearFilter(): void {
    this.selectedProjectId.set(null);
  }

  edit(payment: PaymentData) {
      this.router.navigateByUrl(`/admin/payments/edit/${payment.id}`);
  }

  delete(id: number) {
      if (!confirm('¿Eliminar pago?')) return;
      this.paymentStore.remove(id).subscribe();
  }

  markPaid(id: number) {
      this.paymentStore.changeStatus(id, 'paid').subscribe();
  }

}
