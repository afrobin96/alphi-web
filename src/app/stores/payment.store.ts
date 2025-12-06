import { inject, Injectable, signal } from "@angular/core";
import { PaymentData } from "../interfaces/payments.interface";
import { PaymentService } from "../services/payment";
import { tap } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PaymentStore {
  private _payments = signal<PaymentData[]>([]);
  payments = this._payments.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  paymentService = inject(PaymentService);

  load(){
    this._loading.set(true);
    this.paymentService.list().pipe(
      tap({
        next: (res) => {
          this._payments.set(res);
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        }
      })
    ).subscribe();
  }

  add(payload:{projectId: number, memberId: number, note?: string}){
    return this.paymentService.create(payload).pipe(
      tap((payment) => this._payments.update(current => [payment, ...current] ))
    );
  }

  changeStatus(id:number, status: 'pending' | 'paid' | 'cancelled'){
    return this.paymentService.changeStatus(id, status).pipe(
      tap((payment) => this._payments.update(current => current.map(x => x.id === payment.id ? payment : x)))
    )
  }

  remove(id:number){
    return this.paymentService.remove(id).pipe(
      tap(()=> this._payments.update(current=> current.filter(payment => payment.id !== id)))
    );
  }
}
