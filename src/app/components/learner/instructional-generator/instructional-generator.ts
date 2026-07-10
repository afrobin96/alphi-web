import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearnerService } from '../../../services/learner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const EDUCATION_LEVELS = [
  { value: 'básico',        label: 'Básico' },
  { value: 'intermedio',    label: 'Intermedio' },
  { value: 'avanzado',      label: 'Avanzado' },
  { value: 'universitario', label: 'Universitario' },
  { value: 'profesional',   label: 'Profesional' },
];

const KNOWLEDGE_AREAS = [
  { value: 'medicina',          label: 'Medicina' },
  { value: 'ingeniería',        label: 'Ingeniería' },
  { value: 'derecho',           label: 'Derecho' },
  { value: 'tecnología',        label: 'Tecnología' },
  { value: 'negocios',          label: 'Negocios' },
  { value: 'educación',         label: 'Educación' },
  { value: 'artes',             label: 'Artes' },
  { value: 'ciencias',          label: 'Ciencias' },
  { value: 'ciencias sociales', label: 'Ciencias Sociales' },
  { value: 'otro',              label: 'Otro' },
];

@Component({
  selector: 'app-instructional-generator',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './instructional-generator.html',
  styleUrl: './instructional-generator.scss'
})

export class InstructionalGenerator {
  private fb             = inject(FormBuilder);
  private learnerService = inject(LearnerService);
  private sanitizer      = inject(DomSanitizer);

  readonly educationLevels = EDUCATION_LEVELS;
  readonly knowledgeAreas  = KNOWLEDGE_AREAS;

  isLoading = signal(false);
  error     = signal('');

  // URL segura del blob para el iframe — null = iframe oculto
  pdfUrl    = signal<SafeResourceUrl | null>(null);

  // Guardamos el blob original para poder descargarlo después
  private pdfBlob: Blob | null = null;

  form = this.fb.group({
    topic:          ['', [Validators.required, Validators.minLength(3)]],
    educationLevel: ['', Validators.required],
    targetAudience: ['', Validators.required],
    knowledgeArea:  ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set('');
    this.pdfUrl.set(null);
    this.pdfBlob = null;

    this.learnerService.generatePdf(this.form.value as any).subscribe({
      next: (blob) => {
        this.pdfBlob = blob;

        // Crear URL del blob y sanearla para el iframe
        const objectUrl = window.URL.createObjectURL(blob);
        this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl));

        this.isLoading.set(false);
      },
      error: (err) => {
        const code = err.error?.code;
        if (code === 'DAILY_LIMIT_REACHED') {
          this.error.set('Alcanzaste el límite diario de tokens. Vuelve mañana.');
        } else if (code === 'MONTHLY_LIMIT_REACHED') {
          this.error.set('Alcanzaste el límite mensual. Contacta al administrador para renovar tu plan.');
        } else if (code === 'SUBSCRIPTION_EXPIRED') {
          this.error.set('Tu suscripción expiró. Contacta al administrador.');
        } else {
          this.error.set('Error al generar el PDF. Intenta de nuevo.');
        }
        this.isLoading.set(false);
      },
    });
  }

  // Descarga manual desde el blob ya disponible
  downloadPdf() {
    if (!this.pdfBlob) return;
    const url  = window.URL.createObjectURL(this.pdfBlob);
    const link = document.createElement('a');
    link.href  = url;
    link.download = `diseno-instruccional-${Date.now()}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Limpiar y generar de nuevo
  reset() {
    this.pdfUrl.set(null);
    this.pdfBlob = null;
    this.error.set('');
    this.form.reset();
  }

}
