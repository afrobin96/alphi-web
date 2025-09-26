import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

  alphiServices: String[] = [
      'Desarrollo e implementación de plataformas educativas',
      'Desarrollo web profesional',
      'Capacitación y formación tecnológica',
      'Soporte técnico y mantenimiento',
      'Consultoría especializada',
  ];

  alphiQuickLinks: String[][] = [
    ['Política de Privacidad', '/policy'],
    ['Términos de Servicio', '/terms'],
    ['Preguntas Frecuentes', '/faq'],
    ['Centro de Ayuda', '/help'],
  ]
}
