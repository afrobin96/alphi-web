import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  wp_consultoria:string = "https://api.whatsapp.com/send/?phone=573153364927&text=hola quisiera una consultoria";
}
