import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LearnerService } from '../../../services/learner';
import { LearnerProfile } from '../../../interfaces/learner-profile.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type View = 'dashboard' | 'upgrade-form';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatIconModule, MatProgressBarModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private learnerService = inject(LearnerService);
  private fb = inject(FormBuilder);

  profile = signal<LearnerProfile | null>(null);
  isLoading = signal(true);
  error = signal('');
  success = signal('');
  actionLoad = signal(false);
  view = signal<View>('dashboard');

  // Formulario de pago (MVP — sin Stripe real aún)
  paymentForm = this.fb.group({
    plan:       ['starter', Validators.required],
    cardHolder: ['', Validators.required],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiry:     ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv:        ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  ngOnInit(): void {
    this.loadProfile();
    // this.learnerService.getProfile().subscribe({
    //   next: (data) => {
    //     this.profile.set(data);
    //     this.isLoading.set(false);
    //   },
    //   error: () => {
    //     this.error.set('Error al cargar el perfil.');
    //     this.isLoading.set(false);
    //   },
    // });
  }

  loadProfile() {
    this.isLoading.set(true);
    this.learnerService.getProfile().subscribe({
      next:  (data) => { this.profile.set(data); this.isLoading.set(false); },
      error: ()     => { this.error.set('Error al cargar el perfil.'); this.isLoading.set(false); },
    });
  }

  // Plan FREE: renovar tokens
  renewFree() {
    this.actionLoad.set(true);
    this.error.set('');
    this.success.set('');

    this.learnerService.renewFree().subscribe({
      next: (res) => {
        this.success.set(res.message);
        this.actionLoad.set(false);
        this.loadProfile();   // refresca barras
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al renovar tokens.');
        this.actionLoad.set(false);
      },
    });
  }

  // Plan pago: mostrar formulario
  showUpgradeForm() {
    this.view.set('upgrade-form');
    this.error.set('');
    this.success.set('');
  }

  cancelUpgrade() {
    this.view.set('dashboard');
    this.paymentForm.reset({ plan: 'starter' });
    this.error.set('');
  }

  // Confirmar pago (MVP: llama al backend sin Stripe real)
  confirmUpgrade() {
    if (this.paymentForm.invalid) return;

    this.actionLoad.set(true);
    this.error.set('');

    const plan = this.paymentForm.value.plan as 'starter' | 'pro';

    this.learnerService.upgradePlan(plan).subscribe({
      next: (res) => {
        this.success.set(res.message);
        this.actionLoad.set(false);
        this.view.set('dashboard');
        this.loadProfile();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al actualizar el plan.');
        this.actionLoad.set(false);
      },
    });
  }

  // Helpers visuales
  get isFree(): boolean {
    return this.profile()?.subscriptionPlan === 'free';
  }

  get canRenewFree(): boolean {
    const p = this.profile();
    if (!p || p.subscriptionPlan !== 'free') return false;
    // Puede renovar si el periodo empezó en un mes anterior al actual
    if (!p.monthlyPeriodStart) return true;
    const start = new Date(p.monthlyPeriodStart);
    const now   = new Date();
    return (
      now.getFullYear() > start.getFullYear() ||
      now.getMonth() > start.getMonth()
    );
  }

  get isSubscriptionExpired(): boolean {
    const p = this.profile();
    // Sin fecha de expiración = plan FREE o sin plan = no está vencido
    if (!p?.subscriptionExpiresAt) return false;
    return new Date() > new Date(p.subscriptionExpiresAt);
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
