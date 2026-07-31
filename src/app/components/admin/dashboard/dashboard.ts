import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  // Calcula el porcentaje de tareas completadas sobre el total
  taskEfficiency = computed(() => {
    const completed = this.summary().tasksCompleted;
    const pending   = this.summary().tasksPending;
    const total     = completed + pending;
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  });

  // Color según el porcentaje
  efficiencyColor = computed(() => {
    const pct = this.taskEfficiency();
    if (pct < 30) return 'danger';   // rojo
    if (pct < 60) return 'warning';  // amarillo
    if (pct < 80) return 'primary';  // azul
    return 'success';                // verde
  });

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
