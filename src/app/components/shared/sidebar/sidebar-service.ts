import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isCollapsed = signal(false);

  toggle(): void {
    this.isCollapsed.update(value => !value);
  }
}
