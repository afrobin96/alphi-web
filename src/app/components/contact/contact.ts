import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact';
import { Loader } from '../shared/loader/loader';
import { AlertService } from '../../services/shared/alert';
import { Alert } from '../shared/alert/alert';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, Loader, Alert],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  contactForm: FormGroup;
  isLoading = false;
  private alertService = inject(AlertService);

  // Lista de servicios disponibles (puede venir de BD o API en el futuro)
  servicios: string[] = [
    'Desarrollo e implementación de plataformas educativas',
    'Desarrollo web profesional',
    'Capacitación y formación tecnológica',
    'Soporte técnico y mantenimiento',
    'Consultoría especializada',
  ];

  constructor(private fb: FormBuilder, private contactservice: ContactService) {
    this.isLoading = false;
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      servicio: ['', Validators.required],  // 👈 Nuevo campo
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    this.isLoading= true;
    if (this.contactForm.valid) {
      this.contactservice.SendMessage(this.contactForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.alertService.show('success', 'Datos enviados correctamente. ¡Gracias por contactarnos!');
          console.log('Datos enviados:', this.contactForm.value);
        },
        error: (error) => {
          this.isLoading = false;
          this.alertService.show('danger', 'Error al enviar el mensaje. Intenta más tarde', );
          console.log('Error al enviar los datos:', error);
        }
      })
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
