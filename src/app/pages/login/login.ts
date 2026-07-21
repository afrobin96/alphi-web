import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { AuthStore } from '../../stores/auth.store';
import { Router, RouterLink } from '@angular/router';
import { Loader } from '../../components/shared/loader/loader';
import { Alert } from '../../components/shared/alert/alert';
import { AlertService } from '../../services/shared/alert';

@Component({
  selector: 'app-login',
  imports: [Loader, Alert, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private alertService = inject(AlertService);

  loginForm = this.fb.group({
    username:['', Validators.required],
    password:['', Validators.required]
  })

  isLoading = false;
  error = signal('');

  onSubmit(){
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.isLoading=true;
    this.error.set('');

    this.authService.login(username!, password!).subscribe({
      next: (res) => {
        this.authStore.setAuth(res.access_token, res.user);
        this.isLoading=false;
        // Redirect según rol
        if (res.user.role === 'learner') {
          this.router.navigateByUrl('/learner');
        } else {
          this.router.navigateByUrl('/admin');
        }
      },
      error: (err) => {
        this.error.set(err.error?.mesasage || 'Error al iniciar sesión');
        this.alertService.show('danger', this.error());
        this.isLoading=false;
      }
    })
  }

}
