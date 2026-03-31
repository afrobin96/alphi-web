import { Component, ElementRef, viewChild } from '@angular/core';
import { Header } from '../../components/shared/header/header';
import { alphiServices } from '../../interfaces/alphiService.interface';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/shared/footer/footer';
import { Navbar } from '../../components/shared/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [Header, Contact, Footer, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  slider = viewChild<ElementRef>('sliderContainer');
  alphiServices: alphiServices[] = [
    {
      id: 1,
      name: 'Consultoría especializada',
      icon: 'bi bi-chat-left',
      hexBg: '#fff7ed',
      hexText: '#ea580c',
      description:
        'Asesoramiento estratégico en transformación digital educativa para maximizar el impacto de la tecnología.',
      availableServices: [
        'Análisis de necesidades',
        'Planificación estratégica',
        'Optimización de procesos',
        'Evaluación de resultados',
      ],
    },
    {
      id: 2,
      name: 'Desarrollo e implementación de plataformas educativas',
      icon: 'bi bi-book',
      hexBg: '#ecfdf5',
      hexText: '#059669',
      description:
        'Creamos plataformas LMS personalizadas con todas las funcionalidades necesarias para una experiencia educativa completa.',
      availableServices: [
        'Aulas virtuales interactivas',
        'Sistema de evaluaciones',
        'Gestión de contenidos multimedia',
        'Seguimiento del progreso estudiantil',
      ],
    },
    {
      id: 3,
      name: 'Desarrollo web profesional',
      icon: 'bi bi-globe',
      hexBg: '#fffbeb',
      hexText: '#d97706',
      description:
        'Sitios web modernos y responsivos que representan la identidad de tu institución educativa con la mejor tecnología.',
      availableServices: [
        'Diseño responsive',
        'Optimización SEO',
        'Integración con sistemas existentes',
        'Panel de administración',
      ],
    },
    {
      id: 4,
      name: 'Capacitación y formación tecnológica',
      icon: 'bi bi-people',
      hexBg: '#eff6ff',
      hexText: '#2563eb',
      description:
        'Programas de formación especializados para docentes y personal administrativo en el uso de nuevas tecnologías.',
      availableServices: [
        'Cursos personalizados',
        'Metodologías pedagógicas digitales',
        'Certificaciones oficiales',
        'Soporte continuo post-formación',
      ],
    },
    {
      id: 5,
      name: 'Soporte técnico y mantenimiento',
      icon: 'bi bi-gear',
      hexBg: '#f5f3ff',
      hexText: '#7c3aed',
      description:
        'Servicios integrales de mantenimiento, actualizaciones y soporte técnico para garantizar el funcionamiento óptimo.',
      availableServices: [
        'Monitoreo 24/7',
        'Actualizaciones automáticas',
        'Backup y recuperación',
        'Mesa de ayuda especializada',
      ],
    },
  ];

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
