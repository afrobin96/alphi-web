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
import { MemberStore } from '../../../../stores/member.store';

type DateFilterType = 'day' | 'month' | 'year';
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
  styleUrl: './payments-list.scss',
})
export class PaymentsList implements OnInit {
  paymentStore = inject(PaymentStore);
  projectStore = inject(ProjectStore);
  memberStore = inject(MemberStore);
  router = inject(Router);

  projects = this.projectStore.projects;
  members = this.memberStore.members;
  loading = this.paymentStore.loading;

  // Señal del proyecto seleccionado para filtrar
  selectedProjectId = signal<number | null>(null);

  // Señal del miembro seleccionado para filtrar
  selectedMemberId = signal<number | null>(null);

  // valor del input date
  selectedDate = signal<string>('');
  selectedDateFilter = signal<DateFilterType>('day');

  // Computed: filtra pagos según proyecto seleccionado
  // Aplica ambos filtros simultáneamente
  filteredPayments = computed(() => {
    const projectId = this.selectedProjectId();
    const memberId = this.selectedMemberId();
    const dateStr = this.selectedDate();
    const filterType = this.selectedDateFilter();

    return (
      this.paymentStore
        .payments()
        .filter((p) => {
          const matchProject = projectId ? p.project.id === projectId : true;
          const matchMember = memberId ? p.member.id === memberId : true;
          const matchDate = dateStr
            ? this.matchDate(p.createdAt!, dateStr, filterType)
            : true;
          return matchProject && matchMember && matchDate;
        })
        // Ordenar por fecha descendente
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
        )
    );
  });

  private matchDate(createdAt: string, dateStr: string, type: DateFilterType): boolean {
  // Usar hora LOCAL para que coincida con lo que ve el usuario en pantalla
  const paymentDate = new Date(createdAt);

  switch (type) {
    case 'day': {
      const [year, month, day] = dateStr.split('-').map(Number);
      return (
        paymentDate.getFullYear() === year     &&
        paymentDate.getMonth()    === month - 1 &&
        paymentDate.getDate()     === day
      );
    }
    case 'month': {
      const [year, month] = dateStr.split('-').map(Number);
      return (
        paymentDate.getFullYear() === year     &&
        paymentDate.getMonth()    === month - 1
      );
    }
    case 'year': {
      return paymentDate.getFullYear() === Number(dateStr);
    }
  }
}

  displayedColumns: string[] = [
    'id',
    'member',
    'project',
    'value',
    'status',
    'date',
    'actions',
  ];

  ngOnInit(): void {
    this.paymentStore.load();
    this.projectStore.load();
    this.memberStore.load();
  }

  onProjectFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedProjectId.set(value ? Number(value) : null);
  }

  onMemberFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedMemberId.set(value ? Number(value) : null);
  }

  onDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedDate.set(value);
  }

  onDateFilterType(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as DateFilterType;
    this.selectedDateFilter.set(value);
    this.selectedDate.set(''); // limpiar fecha al cambiar tipo
  }

  clearFilters(): void {
    this.selectedProjectId.set(null);
    this.selectedMemberId.set(null);
    this.selectedDate.set('');
    this.selectedDateFilter.set('day');
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedProjectId() ||
      this.selectedMemberId() ||
      this.selectedDate()
    );
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
