import { Component, inject, OnInit, signal } from '@angular/core';
import { dashboardData } from '../../../interfaces/dashboard.interface';
import { DashboardService } from '../../../services/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  summary = signal<dashboardData>({
    projectsActive: 12,
    clients: 8,
    members: 15,
    tasksPending: 23,
    tasksCompleted: 45,
    paymentsPending: 5
  });

  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
     this.dashboardService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error(err)
    });
  }

}
