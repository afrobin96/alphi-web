import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { dashboardData } from '../../../interfaces/dashboard.interface';
import { DashboardService } from '../../../services/dashboard';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule],
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
  private router = inject(Router);

  ngOnInit(): void {
     this.dashboardService.getSummary().subscribe({
      next: (data) => this.summary.set(data),
      error: (err) => console.error(err)
    });
  }

  navigateTo(route: string): void {
    this.router.navigate(['/admin', route]);
  }

}
