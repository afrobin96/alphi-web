import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  wp_consultoria:string = "https://api.whatsapp.com/send/?phone=573153364927&text=hola quisiera una consultoria";
}
