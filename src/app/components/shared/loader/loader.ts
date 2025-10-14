import { Component, input, Signal } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
  isLoading = input<boolean>();
}
