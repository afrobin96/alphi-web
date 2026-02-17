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
  private platformId = inject(PLATFORM_ID);
  sliderContainer = viewChild<ElementRef>('sliderContainer');

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  }

  // Lógica para scroll del slider
  scrollLeft() {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.sliderContainer()?.nativeElement;
      if (container) {
        container.scrollBy({ left: -350, behavior: 'smooth' });
      }
    }
  }

  scrollRight() {
    if (isPlatformBrowser(this.platformId)) {
      const container = this.sliderContainer()?.nativeElement;
      if (container) {
        container.scrollBy({ left: 350, behavior: 'smooth' });
      }
    }
  }
}
