import { Component, input } from '@angular/core';
import { alphiServices } from '../../alphiService.interface';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {

  services = input.required<alphiServices>();
}
