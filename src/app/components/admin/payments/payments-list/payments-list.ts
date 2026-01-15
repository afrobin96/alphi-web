import { Component, inject, OnInit } from '@angular/core';
import { PaymentStore } from '../../../../stores/payment.store';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { PaymentData } from '../../../../interfaces/payments.interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './payments-list.html',
  styleUrl: './payments-list.scss'
})
export class PaymentsList implements OnInit{

  paymentStore = inject(PaymentStore);
  router = inject(Router);

  payments = this.paymentStore.payments;
  loading = this.paymentStore.loading;

  displayedColumns: string[] = ['member', 'project', 'value', 'status', 'date', 'actions'];

  ngOnInit(): void {
    this.paymentStore.load();
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
