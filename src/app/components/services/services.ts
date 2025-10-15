import { Component, input } from '@angular/core';
import { alphiServices } from '../../interfaces/alphiService.interface';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services {

  services = input.required<alphiServices>();
}
