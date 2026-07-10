import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LearnerService } from '../../../services/learner';
import { LearnerProfile } from '../../../interfaces/learner-profile.interface';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private learnerService = inject(LearnerService);

  profile = signal<LearnerProfile | null>(null);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.learnerService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el perfil.');
        this.isLoading.set(false);
      },
    });
  }

  // Porcentajes para las barras de progreso
  get dailyPercent(): number {
    const p = this.profile();
    if (!p || p.dailyLimit === 0) return 0;
    return Math.min((p.dailyTokensUsed / p.dailyLimit) * 100, 100);
  }

  get monthlyPercent(): number {
    const p = this.profile();
    if (!p || p.monthlyLimit === 0) return 0;
    return Math.min((p.monthlyTokensUsed / p.monthlyLimit) * 100, 100);
  }

  get planLabel(): string {
    const plan = this.profile()?.subscriptionPlan;
    const labels: Record<string, string> = {
      free: 'Gratuito',
      starter: 'Starter',
      pro: 'Pro',
    };
    return labels[plan ?? 'free'] ?? plan ?? '—';
  }

  get planIcon(): string {
    const plan = this.profile()?.subscriptionPlan;
    const icons: Record<string, string> = {
      free: 'emoji_people',
      starter: 'rocket_launch',
      pro: 'workspace_premium',
    };
    return icons[plan ?? 'free'] ?? 'star';
  }

}
