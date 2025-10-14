import { Injectable, signal } from '@angular/core';

export interface Alert {
  type: 'success' | 'danger';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  msg = signal('');
  type = signal<Alert['type']>('success');

  show(type: Alert['type'], message: string) {
    this.type.set(type);
    this.msg.set(message);
    // setTimeout(() => this.msg.set(''), 5000);
  }
}
