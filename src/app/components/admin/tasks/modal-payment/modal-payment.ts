import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PaymentData } from '../../../../interfaces/payments.interface';

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending:   'Pendiente',
  paid:      'Pagado',
  cancelled: 'Cancelado',
};

@Component({
  selector: 'app-modal-payment',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './modal-payment.html',
  styleUrl: './modal-payment.scss'
})
export class ModalPayment {

  payment = input.required<PaymentData>();
  closed  = output<void>();

  statusLabel() {
    return PAYMENT_STATUS_LABELS[this.payment().status] ?? this.payment().status;
  }

  onClose() {
    this.closed.emit();
  }
}
