import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, viewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-plantilla-home',
  imports: [CommonModule],
  templateUrl: './plantilla-home.html',
  styleUrl: './plantilla-home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantillaHome implements OnInit{
  slider = viewChild<ElementRef>('sliderContainer');
  private platformId = inject(PLATFORM_ID);
  services = [
    {
      title: 'Estrategia LMS',
      description: 'Despliegue y personalización de plataformas Canvas, Moodle o Google Workspace.',
      icon: '📚',
      hexBg: '#ecfdf5',
      hexText: '#059669',
      features: ['Configuración cloud', 'Diseño de interfaz UX']
    },
    {
      title: 'Diseño Instruccional',
      description: 'Creación de rutas de aprendizaje gamificadas y materiales interactivos.',
      icon: '💡',
      hexBg: '#fffbeb',
      hexText: '#d97706',
      features: ['Contenido H5P', 'Gamificación avanzada']
    },
    {
      title: 'Formación Docente',
      description: 'Talleres prácticos en herramientas IA y gestión de aulas virtuales.',
      icon: '👥',
      hexBg: '#eff6ff',
      hexText: '#2563eb',
      features: ['IA Generativa', 'Evaluación digital']
    },
    {
      title: 'Web Institucional',
      description: 'Sitios web optimizados para SEO y captación con pasarelas de pago.',
      icon: '🌐',
      hexBg: '#f5f3ff',
      hexText: '#7c3aed',
      features: ['Velocidad carga A+', 'Integración CRM']
    },
    {
      title: 'Analítica de Datos',
      description: 'Dashboards predictivos para prevenir la deserción escolar.',
      icon: '📊',
      hexBg: '#fff7ed',
      hexText: '#ea580c',
      features: ['Machine Learning', 'KPIs en tiempo real']
    }
  ];

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
     if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
    }
  }

  // Lógica para scroll del slider
  scrollLeft() {
    const el = this.slider()?.nativeElement;
    if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
  }

  scrollRight() {
    const el = this.slider()?.nativeElement;
    if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
  }
}
