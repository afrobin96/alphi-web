import { Component, inject } from '@angular/core';
import { AlertService } from '../../../services/shared/alert';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  alert:AlertService = inject(AlertService);
}
