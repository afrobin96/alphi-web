import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { alphiServices } from '../../alphiService.interface';
import { Services } from '../../components/services/services';

@Component({
  selector: 'app-home',
  imports: [Header, Services],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  alphiServices: alphiServices[] = [
    {
    id: 1,
    name: 'Desarrollo e implementación de plataformas educativas',
    icon: 'bi bi-book',
    iconColor: 'blue',
    description: 'Creamos plataformas LMS personalizadas con todas las funcionalidades necesarias para una experiencia educativa completa.',
    availableServices: [
      'Aulas virtuales interactivas',
      'Sistema de evaluaciones',
      'Gestión de contenidos multimedia',
      'Seguimiento del progreso estudiantil'
    ],
  },
  {
    id: 2,
    name: 'Desarrollo web profesional',
    icon: 'bi bi-globe',
    iconColor: 'green',
    description: 'Sitios web modernos y responsivos que representan la identidad de tu institución educativa con la mejor tecnología.',
    availableServices: [
      'Diseño responsive',
      'Optimización SEO',
      'Integración con sistemas existentes',
      'Panel de administración'
    ],
  },
  {
    id: 3,
    name: 'Capacitación y formación tecnológica',
    icon: 'bi bi-people',
    iconColor: 'purple',
    description: 'Programas de formación especializados para docentes y personal administrativo en el uso de nuevas tecnologías.',
    availableServices: [
      'Cursos personalizados',
      'Metodologías pedagógicas digitales',
      'Certificaciones oficiales',
      'Soporte continuo post-formación'
    ],
  },
  {
    id: 4,
    name: 'Soporte técnico y mantenimiento',
    icon: 'bi bi-gear',
    iconColor: 'orange',
    description: 'Servicios integrales de mantenimiento, actualizaciones y soporte técnico para garantizar el funcionamiento óptimo.',
    availableServices: [
      'Monitoreo 24/7',
      'Actualizaciones automáticas',
      'Backup y recuperación',
      'Mesa de ayuda especializada'
    ],
  },
  {
    id: 5,
    name: 'Consultoría especializada',
    icon: 'bi bi-chat-left',
    iconColor: 'white',
    description: 'Asesoramiento estratégico en transformación digital educativa para maximizar el impacto de la tecnología.',
    availableServices: [
      'Análisis de necesidades',
      'Planificación estratégica',
      'Optimización de procesos',
      'Evaluación de resultados'
    ],
  },
];
}
