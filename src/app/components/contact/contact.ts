import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  contactForm: FormGroup;

  // Lista de servicios disponibles (puede venir de BD o API en el futuro)
  servicios: string[] = [
    'Desarrollo e implementación de plataformas educativas',
    'Desarrollo web profesional',
    'Capacitación y formación tecnológica',
    'Soporte técnico y mantenimiento',
    'Consultoría especializada',
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
      servicio: ['', Validators.required],  // 👈 Nuevo campo
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Datos enviados:', this.contactForm.value);
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
